import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'topicCountPipe'
})

export class TopicCountPipe implements PipeTransform {
    transform(topics: any, maxCount: number): any {
        //console.log('filtering topics in pipe', topics);
        if (topics !== 'undefined') {
            //console.log('junky', topics );
            let returnTopics = topics.filter((topic: any) => topic.featured);
            returnTopics = returnTopics.slice(0, 8);
            return returnTopics;
        }
        //console.log('returning topics', topics);
        return topics;
    }
}


