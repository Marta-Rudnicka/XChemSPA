import React from 'react';
import { leadingZero } from './functions';
export function timestampMixin(component) {
    return class timestampMixinClass extends component{

        printDate(date){
            if (!date){
                return null;
            }
            if (!(date instanceof Date)){
                date = new Date(Date.parse(date));
            }
            const year = String(date.getFullYear());
            const month = leadingZero(String(date.getMonth() + 1));
            const day = leadingZero(String(date.getDate()));
            const hours = leadingZero(String(date.getHours()));
            const minutes = leadingZero(String(date.getMinutes()));
    
            return (year + '-' + month + '-' + day + '  ' + hours + ':' + minutes)
        }
    
        printTimeDelta(){
            const all_minutes = Math.floor(this.state.elapsedTime / 60000);
            const hours = String(Math.floor(all_minutes/60));
            const minutes = leadingZero(String(all_minutes % 60))
            return hours + ':' + minutes;
        }

        formatTimeDelta(string){
            const re = /[0-9]{2}:[0-9]{2}\.[0-9]{1}/
            return string.match(re)[0]
        }
    }
}