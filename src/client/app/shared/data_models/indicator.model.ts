export class Indicator {
    indicator: string;
    topics: string;
    collections: string;
    selected: boolean;
    constructor(indicator: string, topics: string, collections:string, selected:boolean) {
        this.indicator = indicator;
        this.topics = topics;
        this.collections = collections;
        this.selected = selected;
    }

    toggleSelected() {
        this.selected = !this.selected;
    }
}
