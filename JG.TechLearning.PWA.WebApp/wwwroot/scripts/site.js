$(document).ready(function ()
{
    //service worker registration
    if ('serviceWorker' in navigator)
    {
        console.log('Service Worker is supported');
        navigator.serviceWorker.register('/tspa-serviceworker.js')
            .then(function (swReg)
            {
                console.log('Service Worker is registered from site.js', swReg);
            })
            .catch(function (error)
            {
                console.error('Service Worker Error from site.js', error);
            });
    }
    else
    {
        console.error('Service Worker Not Supported');
    }

    //database creation (if needed)
    Helpers.BrowserComponentGetter.GetIndexedDbComponent((indexDbComponent) =>
    {
        if (indexDbComponent)
        {
            const tspaDb = new DAL.TspaDatabase();
            tspaDb.BuildIfNeeded(indexDbComponent);

            tspaDb.GetLastProjNumber((lastProj) =>
            {
                console.log("Last proj:::" + lastProj);
            });
        }
    });

    Helpers.NavigationHelper.LogDatabaseSizeToConsole();
});