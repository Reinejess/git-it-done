var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//created to be executed with a form submission browser event
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = " ";
    } else {
        alert("Please enter a GitHub username.")
    }
};


var getUserRepos = function(user) {
    //format the github api url
    var apiURL = "https://api.github.com/users/" + user + "/repos";
    
    //make a request to the url
    fetch(apiURL)
        .then(function(response) {
        //request was successful
        if (response.ok) {
        response.json().then(function(data) {
            //causes repo names to be directly shown in console in an array
            displayRepos(data, user);
        });
        }   else {
            alert("Error: GitHub User Not Found");
        }
    })
        .catch(function(error) {
        //notice this '.catch()' getting chained onto the end of the '.then()' method
            alert("Unable to connect to GitHUb");
    });

}


//creating a function to display repos
    var displayRepos = function(repos, searchTerm) {
        if (repos.length === 0) {
            repoContainerEl.textContent = "No repositories found.";
            return;
        }

        //clear old content
        repoContainerEl.textContent = " ";
        repoSearchTerm.textContent = searchTerm;

        //loop over repos
        for (var i = 0; i < repos.length; i++) {
            //format repo name
            var repoName = repos[i].owner.login + "/" + repos[i].name;

            //create a container for each repo
            var repoEl = document.createElement("div");
            repoEl.classList = "list-item flex-row justify-space-between align-center";

            //create a span element to hold repository name
            var titleEl = document.createElement("span");
            titleEl.textContent = repoName;

            //append to the container
            repoEl.appendChild(titleEl);

            //create a status element
            var statusEl = document.createElement("span");
            statusEl.classList = "flex-row align-center";

            //check if current repo has issues or not
            if (repos[i].open_issues_count > 0 ) {
                statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + "issue(s)"; 
            }   else {
                statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
            }

            repoEl.appendChild(statusEl);
            
            //append container to the dom 
            repoContainerEl.appendChild(repoEl);
        }
    };




userFormEl.addEventListener("submit", formSubmitHandler);