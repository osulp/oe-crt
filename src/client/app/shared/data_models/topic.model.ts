export class Topic {
    topic: string;
    domain: string;
    selected: boolean;
    constructor(topic: string, domain: string, selected:boolean) {
        this.topic = topic;
        this.domain = domain;
        this.selected = selected;
    }

    toggleSelected() {
        this.selected = !this.selected;

    }
}
