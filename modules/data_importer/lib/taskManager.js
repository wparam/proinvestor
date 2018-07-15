module.exports = class TaskManager{
    constructor() {
        this.tasks = new Map(); 
    }
    
    createTask(taskName, importer){
        if(this.tasks.has(taskName))
            return this.tasks.get(taskName);
        return this.tasks.set(taskName, importer);
    }

    cancelTask(taskName){   
        if(!this.tasks.has(taskName))
            return false;
        return this.tasks.delete(taskName);
    }
    
    async processTasks(){
        if(this.tasks.keys.length === 0)
            return Promise.reject(new Error('Tasks list is empty'));
        return Promise.all(Array.from(this.tasks.values());
    }
    
    /**async function to run task
     * @param  {} taskName
     */
    async runTask(taskName) {
        if(!taskName || !this.tasks.has(taskName) || !this.tasks.get(taskName)){
            return Promise.reject(new Error(`Task doest exist: ${taskName}`));
        }
        return this.tasks.get(taskName).import();
    }
}