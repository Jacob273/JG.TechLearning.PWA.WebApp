document.addEventListener('DOMContentLoaded', function ()
{
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

}, false);