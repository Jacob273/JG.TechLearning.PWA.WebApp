namespace DAL
{

    export class Project
    {
        ParentProjectNumber: String;
        ProjectNumber: String;
        WorkingDate: Date;
        WorkingHours: Number;
        File: any;

        constructor(parentProjectNumber: String, projectNumber: String, workingDate: Date, workingHours: Number, file: any = null)
        {
            this.ParentProjectNumber = parentProjectNumber;
            this.ProjectNumber = projectNumber;
            this.WorkingDate = workingDate;
            this.WorkingHours = workingHours;
            this.File = file;//optional?
        }

        Display(): void
        {
            console.log("Polish Project Number " + this.ParentProjectNumber);
        }
    }

    export class TspaDatabase
    {
        DatabaseVersion: String;
        DatabaseName: String;
        ProjectsStorageName: String;

        constructor(databaseName: String = "TSPA.Database", databaseVersion: String = "2", projectsStorageName: String = "ProjectsStore")
        {
            this.DatabaseName = databaseName;
            this.DatabaseVersion = databaseVersion;
            this.ProjectsStorageName = projectsStorageName;
        }

        public BuildIfNeeded(indexedDb: any)
        {
            console.log("IndexedDB component can be used. Trying to connect to: " + this.DatabaseName + ", version " + this.DatabaseVersion + ".");

            var openRequest = indexedDb.open(this.DatabaseName, this.DatabaseVersion);

            openRequest.onerror = function (event: any)
            {
                console.log("Error! IndexedDB cannot be used!" + event.target.result);
            };

            openRequest.onsuccess = function (event: any)
            {
                console.log("Success! IndexedDB is ready to use!");
                var tspaDatabase = event.target.result;
                tspaDatabase.close();
            };

            openRequest.onupgradeneeded = function (event: any)
            {
                console.log("Upgrade is required! Processing...");

                var tspaDatabase = event.target.result;

                var objectStore = tspaDatabase.createObjectStore(this.ProjectsStorageName, { keyPath: "ParentProjectNumber" });

                objectStore.createIndex("WorkingDate", "WorkingDate", { unique: false });
                objectStore.createIndex("ParentProjectNumber", "ParentProjectNumber", { unique: true });

                objectStore.transaction.oncomplete = function (event: any)
                {
                    //creation of ProjectsStore completed
                    var ProjectsStore = tspaDatabase
                        .transaction(this.ProjectsStorageName, "readwrite")
                        .objectStore(this.ProjectsStorageName);

                    const projectRep = new ProjectRepository();
                    projectRep.Data.forEach(function (projectData)
                    {
                        console.log("Adding to database " + projectData.ParentProjectNumber);
                        ProjectsStore.add(projectData);
                    });

                    tspaDatabase.close();
                };

                objectStore.transaction.onerror = function (event: any)
                {
                    console.log("transaction error");
                    tspaDatabase.close();
                };
            };
        }

        public GetFile(parentProjectNumberToSearch: String, onGetDataCallback: any)
        {
            this.GetProject(parentProjectNumberToSearch, (proj: any) =>
            {
                onGetDataCallback(proj.File);
            });
        }

        public GetProject(parentProjectNumberToSearch: String, onGetDataCallback: any)
        {
            console.log("Retrieving data related to project with number: " + parentProjectNumberToSearch);

            Helpers.BrowserComponentGetter.GetIndexedDbComponent((indexedDb : any) =>
            {
                if (!indexedDb)
                {
                    console.log("Cannot access indexedDb...");
                    onGetDataCallback(null);
                }

                var openRequest = indexedDb.open(this.DatabaseName, this.DatabaseVersion);

                openRequest.onsuccess = function (event: any)
                {
                    console.log("Connection established to: " + this.DatabaseName);

                    var tspaDatabase = event.target.result;

                    tspaDatabase.transaction(this.ProjectsStorageName)
                        .objectStore(this.ProjectsStorageName)
                        .get(parentProjectNumberToSearch)
                        .onsuccess = function (event: any)
                        {
                            console.log(" 1 " + event.target.result);
                            onGetDataCallback(event.target.result);
                            tspaDatabase.close();
                        },
                        onerror = function (event: any)
                        {
                            tspaDatabase.close();
                            console.log("Transaction::Get error.")
                        };
                }
            });
        }

        public InsertProject(newProject: Project, onGetDataCallback: any)
        {
            Helpers.BrowserComponentGetter.GetIndexedDbComponent((indexedDb: any) =>
            {

                if (!indexedDb)
                {
                    console.log("Cannot access indexedDb...");
                    onGetDataCallback(null);
                }

                var openRequest = indexedDb.open(this.DatabaseName, this.DatabaseVersion);

                openRequest.onsuccess = function (event: any)
                {
                    var tspaDatabase = event.target.result;

                    tspaDatabase.transaction(this.ProjectsStorageName, "readwrite")
                        .objectStore(this.ProjectsStorageName)
                        .put(newProject)
                        .onsuccess = function (event: any)
                        {
                            console.log("put suceess");
                            onGetDataCallback(event);
                        },
                        onerror = function (event: any)
                        {
                            console.log('error storing data !!!!' + event);
                        };
                }

                openRequest.onerror = function (event: any)
                {
                    var tspaDatabase = event.target.result;
                    tspaDatabase.close();
                };
            });
        }

        public GetMaxNumber(onGetDataCallback: any)
        {
        //todo:
        //    Helpers.BrowserComponentGetter.GetIndexedDbComponent((indexedDb: any) =>
        //    {
        //        var openReq = indexedDb.open(this.DatabaseName, this.DatabaseVersion);

        //        openReq.onsuccess = function ()
        //        {
        //            var db = openReq.result;
        //            var transaction = db.transaction(this.ProjectsStorageName, 'readonly');
        //            var objectStore = transaction.objectStore(this.ProjectsStorageName);
        //            var index = objectStore.index('revision');
        //            var openCursorRequest = index.openCursor(null, 'prev');
        //            var maxRevisionObject = null;

        //            openCursorRequest.onsuccess = function (event : any)
        //            {
        //                if (event.target.result)
        //                {
        //                    onGetDataCallback(event.target.result.value); //the object with max revision
        //                }
        //            };
        //        }

        //    });
        }
    }

    class ProjectRepository
    {
        Data: Project[] = [
            new Project("999-44-4444", "001", new Date("2020-01-20"), 5),
            new Project("888-44-4444", "002", new Date("2020-01-21"), 3),
            new Project("777-44-4444", "003", new Date("2020-01-22"), 7),
            new Project("666-44-4444", "004", new Date("2020-01-23"), 8),
            new Project("555-44-4444", "005", new Date("2020-01-24"), 3),
            new Project("444-44-4444", "006", new Date("2020-01-25"), 2),
            new Project("333-44-4444", "007", new Date("2020-01-26"), 1),
            new Project("222-44-4444", "008", new Date("2020-01-27"), 2)
        ];
    }
}