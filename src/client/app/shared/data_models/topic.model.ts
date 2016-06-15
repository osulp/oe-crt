export class Topic {
    topic: string;
    icon: string;
    featured: boolean;
    selected: boolean;
    
    constructor(topic: string, icon: string, featured: boolean, selected: boolean) {
        this.topic = topic;
        this.icon = icon;
        this.featured = featured;
        this.selected = selected;
    }

    toggleSelected() {
        this.selected = !this.selected;
    }
}
