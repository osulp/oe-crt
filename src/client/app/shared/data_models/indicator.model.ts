export class Indicator {
    indicator: string;
    indicator_display: string;
    topics: string;
    collections: string;
    selected: boolean;
    constructor(indicator: string, topics: string, collections: string, selected: boolean, indicator_display?: string) {
        this.indicator = indicator;
        this.indicator_display = indicator_display;
        this.topics = topics;
        this.collections = collections;
        this.selected = selected;
    }

    toggleSelected() {
        this.selected = !this.selected;
    }

}
