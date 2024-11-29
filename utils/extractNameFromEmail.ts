

export function extractNameFromEmail(email: string): string | null {
    // Basic email regex pattern
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (emailPattern.test(email)){
        const [name] = email.split("@");
        return name;
    }else{
        return null;
    }
}

