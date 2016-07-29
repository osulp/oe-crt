export class Topic {
    topic: string;
    icon: string;
    featured: boolean;
    selected: boolean;
    collections: string;

    constructor(topic: string, icon: string, featured: boolean, selected: boolean, collections: string) {
        this.topic = topic;
        this.icon = icon;
        this.featured = featured;
        this.selected = selected;
        this.collections = collections;
    }

    toggleSelected() {
        this.selected = !this.selected;
    }
}
