$(document).ready(function ()
{
    var indexedDb = GetIndexedDb();
    const databaseVersion = 3;
    const databaseName = "TSPA.Database";

    if (indexedDb)
    {
        console.log("IndexedDB exists! :)");


        var request = indexedDb.open(databaseName, databaseVersion);


        request.onerror = function (event)
        {
            console.log("Error IndexedDB cannot be used ?!");
        };

        request.onsuccess = function (event)
        {
            console.log("Open() - Success");
            var tspaDatabase = event.target.result;
            tspaDatabase.close();
        };

        request.onupgradeneeded = function (event)
            {
            console.log("UpgradeNeeded()");

            var tspaDatabase = event.target.result;

            var objectStore = tspaDatabase.createObjectStore("projectInstances", { keyPath: "nr_proj_gl" });

            objectStore.createIndex("date", "date", { unique: false });
            objectStore.createIndex("nr_proj_gl", "nr_proj_gl", { unique: true });

            // Use transaction oncomplete to make sure the objectStore creation is 
            // finished before adding data into it.
            objectStore.transaction.oncomplete = function (event)
            {
                var projectInstancesStore = tspaDatabase
                    .transaction("projectInstances", "readwrite")
                    .objectStore("projectInstances");

                projectData.forEach(function (projectData)
                {
                    console.log("Adding to database " + projectData.nr_proj_gl);
                    projectInstancesStore.add(projectData);
                });
            };
        };

    }
});

const projectData = [
    { nr_proj_gl: "444-44-4444", name: "AAA", date: "2020-20-20", email: "a@company.com", hours: "3" },
    { nr_proj_gl: "155-55-5555", name: "BBBB", date: "2020-20-20", email: "b@home.org", hours: "3" },
    { nr_proj_gl: "255-55-5555", name: "CCCC", date: "2020-20-20", email: "c@home.org", hours: "3" },
    { nr_proj_gl: "355-55-5555", name: "DDDDD", date: "2020-20-20", email: "d@home.org", hours: "3" },
    { nr_proj_gl: "455-55-5555", name: "AAA", date: "2020-20-20", email: "e@home.org", hours: "3" },
    { nr_proj_gl: "555-55-5555", name: "WoAAjtek", date: "2020-20-20", email: "f@home.org", hours: "3" },
    { nr_proj_gl: "655-55-5555", name: "SSSS", date: "2020-20-20", email: "g@home.org", hours: "3" },
    { nr_proj_gl: "755-55-5555", name: "WojDDDtek", date: "2020-20-20", email: "h@home.org", hours: "3" },
    { nr_proj_gl: "855-55-5555", name: "DDD", date: "2020-20-20", email: "i@home.org", hours: "3" },
    { nr_proj_gl: "955-55-5555", name: "FFFF", date: "2020-20-20", email: "j@home.org", hours: "3" },
    { nr_proj_gl: "105-55-5555", name: "SSSS", date: "2020-20-20", email: "k@home.org", hours: "3" },
    { nr_proj_gl: "105-55-5555", name: "SSSS", date: "2020-20-20", email: "k@home.org", hours: "3" }
];

function GetIndexedDb()
{
    return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
}