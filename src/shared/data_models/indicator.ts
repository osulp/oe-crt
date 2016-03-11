export class Indicator {
    indicator: string;
    topics: string;
    selected: boolean;
    constructor(indicator: string, topics: string, selected:boolean) {
        this.indicator = indicator;
        this.topics = topics;
        this.selected = selected;
    }

    toggleSelected() {
        this.selected = !this.selected;

    }
}
