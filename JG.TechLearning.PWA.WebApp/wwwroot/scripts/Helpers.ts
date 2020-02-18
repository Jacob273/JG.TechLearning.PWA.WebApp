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
}