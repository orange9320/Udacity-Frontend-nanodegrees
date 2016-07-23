var bio = {
    name: "Zhenbang JU",
    role: "Web Developer",
    contacts: {
        mobile: "573-818-5168",
        email: "elog9320@gmail.com",
        github: "https://github.com/orange9320",
        location: "Los Angeles, CA 90034"
    },
    welcomeMessage: "Thanks for having a look at my Resume!",
    skills: ["HTML", "CSS", "JavaScript", "Java", "Python"],
    biopic: "images/biopic.jpg",

    "display": function() {
        // Header
        $("#header").prepend(HTMLheaderRole.replace("%data%", this.role));
        $("#header").prepend(HTMLheaderName.replace("%data%", this.name));

        // Contact top
        $("#topContacts").append(HTMLmobile.replace("%data%", this.contacts.mobile));
        $("#topContacts").append(HTMLemail.replace("%data%", this.contacts.email));
        $("#topContacts").append(HTMLgithub.replace("%data%", this.contacts.github));
        $("#topContacts").append(HTMLlocation.replace("%data%", this.contacts.location));

        // Contact foot
        $("#footerContacts").append(HTMLmobile.replace("%data%", this.contacts.mobile));
        $("#footerContacts").append(HTMLemail.replace("%data%", this.contacts.email));
        $("#footerContacts").append(HTMLgithub.replace("%data%", this.contacts.github));
        $("#footerContacts").append(HTMLlocation.replace("%data%", this.contacts.location));

        // Bio Image and welcome msg
        $("#header").append(HTMLbioPic.replace("%data%", this.biopic));
        $("#header").append(HTMLwelcomeMsg.replace("%data%", this.welcomeMessage));

        // Skills
        $("#header").append(HTMLskillsStart);
        for (var i = 0; i < this.skills.length; i++) {
            $("#skills").append(HTMLskills.replace("%data%", this.skills[i]));
        }
        $("#skills").toggleClass("flex-box"); // Make it same with mockup
    }
};

var work = {
    jobs: [{
        employer: "University of Missouri, Columbia",
        title: "Research Assistant",
        location: "Columbia, MO",
        dates: "April 2014 - December 2015",
        description: "Developed experiments to be used in a computational intelligence textbook."
    }, {
        employer: "(Test purpose)University of Missouri, Columbia",
        title: "(Test purpose)Research Assistant",
        location: "(Test purpose)Columbia, MO",
        dates: "(Test purpose)April 2014 - December 2015",
        description: "(Test purpose)Developed experiments to be used in a computational intelligence textbook."
    }],

    "display": function() {
        
        // iterate go through each job
        for (var i = 0; i < this.jobs.length; i++) {
        	$("#workExperience").append(HTMLworkStart);
            var curWork = $(".work-entry").last();
            // in case browser automatic adding </a> if append(formattedEmployer) and append(formattedTitle) here
            var formattedEmployer = HTMLworkEmployer.replace("%data%", this.jobs[i].employer);
            var formattedTitle = HTMLworkTitle.replace("%data%", this.jobs[i].title);
            curWork.append(formattedEmployer + formattedTitle);

            // I still like this format
            curWork.append(HTMLworkDates.replace("%data%", this.jobs[i].dates));
            curWork.append(HTMLworkLocation.replace("%data%", this.jobs[i].location));
            curWork.append(HTMLworkDescription.replace("%data%", this.jobs[i].description));
        }
    }
};

var projects = {
    projects: [{
        title: "Machine Learning Facial Expression Recognition",
        dates: "August 2015 - November 2015",
        description: "Designed a hierarchical Multi-SVM processing and learning model for image data," + 
			" and achieved 83.7% average correct rate for the 5 target expressions.",
        images: [
            "images/p1img1.jpg",
            "images/p1img2.jpg",
            "images/p1img3.jpg",
            "images/p1img4.jpg",
            "images/p1img5.jpg"
        ]
    }],

    "display": function() {
        $("#projects").append(HTMLprojectStart);
        for (var i = 0; i < projects.projects.length; i++) {
            var curProj = $(".project-entry").last();
            curProj.append(HTMLprojectTitle.replace("%data%", this.projects[i].title));
            curProj.append(HTMLprojectDates.replace("%data%", this.projects[i].dates));
            curProj.append(HTMLprojectDescription.replace("%data%", this.projects[i].description));
            var curImages = this.projects[i].images;
            for (var j = 0; j < curImages.length; j++) {
                curProj.append(HTMLprojectImage.replace("%data%", this.projects[i].images[j]));
            }
        }
    }
};

var education = {
    schools: [{
        name: "University of Missouri, Columbia",
        location: "Columbia, MO",
        degree: "Master of Science",
        majors: ["ECE"],
        dates: "2016",
        url: "http://www.ecust.edu.cn"
    }, {
        name: "East China University of Science And Technology",
        location: "Shanghai, China",
        degree: "Bachelor  of Science",
        majors: ["Information Engineering"],
        dates: "2014",
        url: "http://missouri.edu/"
    }],

    onlineCourses: [{
        title: "Front-End Web Developer Nanodegree",
        school: "Udacity",
        dates: "2016",
        url: "https://www.udacity.com/"
    }],

    "display": function() {
        for (var i = 0; i < this.schools.length; i++) {
        	$("#education").append(HTMLschoolStart);
            var curSchool = $(".education-entry").last();
            var formattedName = HTMLschoolName.replace("%data%", this.schools[i].name).replace("#", this.schools[i].url);
            var formattedDegree = HTMLschoolDegree.replace("%data%", this.schools[i].degree);

            curSchool.append(formattedName + formattedDegree);
            curSchool.append(HTMLschoolDates.replace("%data%", this.schools[i].dates));
            curSchool.append(HTMLschoolLocation.replace("%data%", this.schools[i].location));

            var curMajors = this.schools[i].majors[0];
            for(var j = 1; j < this.schools[i].majors.length; j++){
            	curMajors = curMajors + ", " + this.schools[i].majors[j];
            }
            curSchool.append(HTMLschoolMajor.replace("%data%", curMajors));

        };

        if(this.onlineCourses.length > 0)	$("#education").append(HTMLonlineClasses);
        for (var i = 0; i < this.onlineCourses.length; i++) {
        	$("#education").append(HTMLschoolStart);
            var curOLCourse = $(".education-entry").last();
            var formattedTitle = HTMLonlineTitle.replace("%data%", this.onlineCourses[i].title);
            var formattedSchool = HTMLonlineSchool.replace("%data%", this.onlineCourses[i].school);

            curOLCourse.append(formattedTitle + formattedSchool);
            curOLCourse.append(HTMLonlineDates.replace("%data%", this.onlineCourses[i].dates));
            curOLCourse.append(HTMLonlineURL.replace("%data%", this.onlineCourses[i].url));
        }
    }
}


$("#mapDiv").append(googleMap);


bio.display();
work.display();
projects.display();
education.display();