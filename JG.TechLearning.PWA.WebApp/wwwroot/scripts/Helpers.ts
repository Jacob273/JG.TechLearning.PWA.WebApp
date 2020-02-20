namespace Helpers
{
    export class DateHelper
    {
        public FormatDate(date: Date)
        {
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];


            if (date)
            {

                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();
            }
            else
            {
                return ' ';
            }

            return day + ' ' + monthNames[monthIndex] + ' ' + year;
        }
    }

    export class NavigationHelper
    {
        public static LogDatabaseSizeToConsole()
        {
            if ('storage' in navigator && 'estimate' in navigator.storage)
            {
                navigator.storage.estimate().then(({ usage, quota }) =>
                {
                    console.log(`NavigationHelper:::: Using ${usage} out of ${quota} bytes.`);
                });
            }
        }
    }

    export class BrowserComponentGetter
    {
        public static GetIndexedDbComponent(onGetComponentCallback: any): any
        {
            var indexedDbComponent = (window as any).indexedDB || (window as any).webkitIndexedDB || (window as any).mozIndexedDB || (window as any).msIndexedDB;
            onGetComponentCallback(indexedDbComponent);
        }
    }
}