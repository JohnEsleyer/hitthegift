

export const loadState = (): any => {
    try{
        const serializedState = localStorage.getItem('state');
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (err){
        console.error("Could not load state", err);
        return undefined;
    }
};

export const saveState = (state: any): void => {
    try{
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    }catch(err){
        console.error("Could not save state", err);
    }
}
