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
        DatabaseVersion: String = "2";
        DatabaseName: String = "TSPA.Database";
        ProjectsStorageName: String = "ProjectsStore";

        public BuildIfNeeded(indexedDb: any)
        {
            console.log("IndexedDB component can be used. Trying to connect to: " + this.DatabaseName + ", version " + this.DatabaseVersion);

            var connection = indexedDb.open(this.DatabaseName, this.DatabaseVersion);

            connection.onerror = function (event: any)
            {
                console.log("Error! IndexedDB cannot be used!" + event.target.result);
            };

            connection.onsuccess = function (event: any)
            {
                console.log("Success! IndexedDB is ready to use!");
                var tspaDatabase = event.target.result;
                tspaDatabase.close();
            };

            connection.onupgradeneeded = function (event: any)
            {
                console.log("Upgrade is required! Processing...");

                var tspaDatabase = event.target.result;

                var objectStore = tspaDatabase.createObjectStore("ProjectsStore", { keyPath: "ParentProjectNumber" });

                objectStore.createIndex("WorkingDate", "WorkingDate", { unique: false });
                objectStore.createIndex("ParentProjectNumber", "ParentProjectNumber", { unique: true });

                objectStore.transaction.oncomplete = function (event: any)
                {
                    //creation of ProjectsStore completed
                    var ProjectsStore = tspaDatabase
                        .transaction("ProjectsStore", "readwrite")
                        .objectStore("ProjectsStore");

                    let projectRep = new ProjectRepository();
                    projectRep.Data.forEach(function (projectData)
                    {
                        console.log("Adding to database " + projectData.ParentProjectNumber);
                        ProjectsStore.add(projectData);
                    });
                };

                objectStore.transaction.onerror = function (event: any)
                {
                    console.log("transaction error");
                };
            };
        }

        public GetFile(parentProjectNumberToSearch: String, onGetDataCallback: any)
        {
            this.GetProject(parentProjectNumberToSearch, (proj: any) =>
            {
                onGetDataCallback(proj);

                onGetDataCallback(proj.File);

            });
        }

        public GetProject(parentProjectNumberToSearch: String, onGetDataCallback: any)
        {
            console.log("Retrieving data related to project with number: " + parentProjectNumberToSearch);
            var indexedDb = this.GetIndexedDbComponent();

            if (!indexedDb)
            {
                console.log("Cannot access indexedDb...");
                onGetDataCallback(null);
            }

            var request = indexedDb.open(this.DatabaseName, this.DatabaseVersion);

            request.onsuccess = function (event: any)
            {
                console.log("Connection established to: " + this.DatabaseName);

                var tspaDatabase = event.target.result;

                tspaDatabase.transaction("ProjectsStore")
                    .objectStore("ProjectsStore")
                    .get(parentProjectNumberToSearch)
                    .onsuccess = function (event: any)
                    {
                        console.log(" 1 " + event.target.result);
                        onGetDataCallback(event.target.result);
                    },
                    onerror = function (event: any)
                    {
                        console.log("Transaction::Get error.")
                    };
            }
        }

        public InsertProject(newProject: Project, onGetDataCallback: any)
        {
            var indexedDb = this.GetIndexedDbComponent();

            if (!indexedDb)
            {
                console.log("Cannot access indexedDb...");
                onGetDataCallback(null);
            }

            var request = indexedDb.open(this.DatabaseName, this.DatabaseVersion);

            request.onsuccess = function (event: any)
            {
                var tspaDatabase = event.target.result;


                tspaDatabase.transaction("ProjectsStore", "readwrite")
                    .objectStore("ProjectsStore")
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
        }


        public GetIndexedDbComponent(): any
        {
            return (window as any).indexedDB || (window as any).webkitIndexedDB || (window as any).mozIndexedDB || (window as any).msIndexedDB;
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