define(['config/config_bootstrap'],
  function (config) {
    return function () {
      this.fetchAllIssues = function (page) {
          return _.object (_(config.getRepos()).map(function (url, name) {
            return [name, $.getJSON(this.repoIssuesURL(url, page))];
          }.bind(this)));
      };

      this.defaultOptions = function () {
        return "per_page=100&state=all&"
      };

      this.getPageParam = function(page){
        return (isFinite(page)) ? "page=" + (page <= 0 ? 1 : page) + "&" : '';
      };

      this.authRequest = function (url) {
        return url + this.accessToken();
      }

      this.repoIssuesURL = function (repo, page) {
        return this.authRequest(repo + '/issues?' + this.defaultOptions() + this.getPageParam(page));
      };

      this.accessToken = function () {
        return "access_token=" + this.getCurrentAuthToken();
      };

      this.newIssueURL = function(projectName){
        var repositoryURL = this.getURLFromProject(projectName);
        return repositoryURL.replace("api.github.com/repos", "github.com") + "/issues/new";
      };

      this.getURLFromProject = function (projectName) {
        return config.getConfig().repos[projectName] || "not found";
      };

      this.getProjectIdentifier = function(projectUrl) {

        if(projectUrl.lastIndexOf('https://api.github.com/repos/',0) === 0) {
          return projectUrl.slice(29);
        }
        if(projectUrl.lastIndexOf('https://github.com/',0) === 0){
          return projectUrl.slice(19).match(/.*?\/.*?(?=\/)/)[0];
        }
      };



      this.getAllProjectsIdentifiers = function(projectNames) { 
        var projectUrls = _.map(projectNames, this.getURLFromProject);

        return _.map(projectUrls,this. getProjectIdentifier);
      };
    };
  }
);
