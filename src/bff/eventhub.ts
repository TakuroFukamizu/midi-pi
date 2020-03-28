import events from 'events';

class EventHub extends events.EventEmitter { 
    constructor() { 
        super();
    }
}

const eventHub = new EventHub();

export default eventHub;