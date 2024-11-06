'use client'
import { getProfilePicture } from "@/app/actions/s3/getProfilePicture";
import uploadProfile from "@/app/actions/s3/uploadProfile";
import { RootState } from "@/lib/store";
import Avvvatars from "avvvatars-react";
import { Pen, Pencil } from "lucide-react";
import { useTransition, useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface EditableUserProfileProps{
    width: number;
    height: number;
}

export default function EditableUserProfile({width, height}:EditableUserProfileProps){
    const userId = useSelector((state: RootState) => state.userData.id);
    const userName = useSelector((state: RootState) => state.userData.firstName);
    const [isPending, startTransition] = useTransition();
    const [isError, setIsError] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [imageUrl, setImageUrl] = useState('');
  
    const fetchProfile = () => {
        setIsError(false);
        startTransition(async ()=>{
            try{
                const res = await getProfilePicture(userId);
                if (res.success){
                    setImageUrl(res.data as string);
                }else{
                    setIsError(true);
                }
            }catch(e: any){
                console.log(e);
                setIsError(true);
            }
        });
    }


    useEffect(()=> {
      console.log(`Upload status: ${uploadStatus}`);
       fetchProfile();
    },[uploadStatus]);

    useEffect(() => {
        fetchProfile();
    },[])


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
      };
    
      const handleUpload = async () => {
        console.log('handle Upload')
        setShowProfileOptions(false)
        if (!file || !userId) {
          setUploadStatus('Please select a file and provide a user ID.');
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file); // Append the renamed file
    
        try {
          setUploadStatus('Uploading...');
          const result = await uploadProfile(formData, userId);
    
          if (result.success) {
            setUploadStatus(`File uploaded successfully: ${result.url}`);
            setImageUrl(`${result.url}`);
          } else {
            setUploadStatus(`Error: ${result.error}`);
          }
        } catch (error: any) {
          setUploadStatus(`Upload failed: ${error.message}`);
        }
        
      };

    return (
        <div className="relative">
            {isPending ? <div className="profile-skeleton" style={{ width: width, height: height }}></div>
             : 
             <div>
                {imageUrl == "" ? <Avvvatars value={userName} size={width}/> : <img className="rounded-full" src={imageUrl} alt={imageUrl} width={width} height={height}/>}
            </div>}
          <div style={{zIndex: 99, bottom:10, right:10}} className="absolute">
                <button className="bg-white rounded-full border p-2" onClick={()=>{setShowProfileOptions((prev) => !prev)}}><Pencil/></button>
                {showProfileOptions && <div style={{zIndex: 100, width: 220}} className="p-2 absolute bg-white shadow-md">
                    <input type="file" onChange={handleFileChange} accept="image/*" style={{width: 210}} className="text-xs" />
                    <button onClick={handleUpload} className="mt-2 pl-2 pr-2 w-full border border-2xl border-black ">Upload</button>
                </div>}
            </div>

        </div>
    )
}