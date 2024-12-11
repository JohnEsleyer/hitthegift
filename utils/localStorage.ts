import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_REDUX_KEY || ''; // Replace with a secure key

export const loadState = (): any => {
    try {
        const encryptedState = localStorage.getItem('state');
        if (!encryptedState) return undefined;

        // Decrypt the state
        const bytes = CryptoJS.AES.decrypt(encryptedState, SECRET_KEY);
        const decryptedState = bytes.toString(CryptoJS.enc.Utf8);

        return JSON.parse(decryptedState); // Parse the decrypted JSON string
    } catch (err) {
        console.error('Could not load state', err);
        return undefined;
    }
};

export const saveState = (state: any): void => {
    try {
        // Serialize and encrypt the state
        const serializedState = JSON.stringify(state);
        const encryptedState = CryptoJS.AES.encrypt(serializedState, SECRET_KEY).toString();

        localStorage.setItem('state', encryptedState); // Store encrypted state
    } catch (err) {
        console.error('Could not save state', err);
    }
};
