  window.onload = function (evt) {
    //check cookie to show
    // to test set cookie to true.  Uncomment line below
    //setCookie('showSurvey', true, 90);
    if (getCookie('showSurvey') !== ' ' && getCookie('showSurvey') !== 'false') {
      var greeting = 'We are gathering feedback.  We are looking for input on the usefulness of this tool.  Your feedback will be greatly appreciated!';
      var surveyLink = 'https://oregonstate.qualtrics.com/jfe/form/SV_6VFTOl7mS3Obd42';

      //CSS  The following css has been minified to reduce the size.  It has been left in for easier viewing.  To change display either uncomment the below css or the minified version below.
      //             var styles = `
      //     /* The Modal (background) */
      // #modalDiv {
      //   position: fixed; /* Stay in place */
      //   z-index: 100; /* Sit on top */
      //   padding-top: 100px; /* Location of the box */
      //   left: 0;
      //   top: 0;
      //   width: 100%; /* Full width */
      //   height: 100%; /* Full height */
      //   overflow: auto; /* Enable scroll if needed */
      //   background-color: rgb(0,0,0); /* Fallback color */
      //   background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
      // }

      // /* Modal Content */
      // #innerModalDiv {
      //   background-color: #fefefe;
      //   margin: auto;
      //   padding: 20px;
      //   border: 1px solid #888;
      //   width: 50%;
      //   text-align: center;
      // }

      // #innerModalDiv p {
      //     text-align: left;
      //     padding: 0 20px;
      // }

      // /* The Close Button */
      // .close {
      //   color: #aaaaaa;
      //   float: right;
      //   font-size: 28px;
      //   font-weight: bold;
      // }

      // .close:hover,
      // .close:focus {
      //   color: #000;
      //   text-decoration: none;
      //   cursor: pointer;
      // }

      // .surveyBtn{
      //     padding:10px;
      //     background-color: #98BD85;
      //     color:black;
      //     display: inline-block;
      //     max-width: 30%;
      //     margin:10px 10%;
      //     text-align: center;
      // }

      // .surveyBtn.no {
      //     background-color: #C34500;
      //     color: white;
      // }

      // .surveyBtn:hover{
      //     text-decoration: underline;
      //     cursor: pointer;

      // }
      // #dontShowAgain{
      //     display:inline-block;
      //     padding:10px;
      //     margin-left:20px;
      // }
      // #dontShowAgainLbl{
      //     margin-left: 8px;
      //     color:gray;
      // }
      // `;
      //minified version of the css above
      var styles = '#modalDiv{position:fixed;z-index:10000;padding-top:100px;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgb(0,0,0);background-color:rgba(0,0,0,.4)}#innerModalDiv{background-color:#fefefe;margin:auto;padding:20px;border:1px solid #888;width:50%;text-align:center}#innerModalDiv p{text-align:left;padding:0 20px}.close{color:#aaa;float:right;font-size:28px;font-weight:700}.close:hover,.close:focus{color:#000;text-decoration:none;cursor:pointer}.surveyBtn{padding:10px;background-color:#98BD85;color:#000;display:inline-block;max-width:30%;margin:10px 10%;text-align:center}.surveyBtn.no{background-color:#C34500;color:#fff}.surveyBtn:hover{text-decoration:underline;cursor:pointer}#dontShowAgain{display:inline-block;padding:10px;margin-left:20px}#dontShowAgainLbl{margin-left:8px;color:gray}';
      var styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);

      //Add HTML
      //Modal
      var modalDiv = document.createElement('div');
      modalDiv.id = 'modalDiv';
      //Popup content
      var innerModalDiv = document.createElement('div');
      innerModalDiv.id = 'innerModalDiv';
      //Close button
      var innerModalDivSpan = document.createElement('span');
      innerModalDivSpan.className = 'close';
      innerModalDivSpan.innerHTML = '&times;';
      innerModalDiv.appendChild(innerModalDivSpan);
      //Text and description
      var innerModalDivP = document.createElement('p');
      innerModalDivP.innerHTML = '<center><h2>Take our Survey!</h2></center><hr>';
      //Enter greeting/description text below.
      innerModalDivP.innerHTML += greeting;
      innerModalDiv.appendChild(innerModalDivP);
      //Div for buttons
      var innerModalDivButtonOk = document.createElement('div');
      innerModalDivButtonOk.id = 'btnSurvey';
      innerModalDivButtonOk.className = 'surveyBtn';
      innerModalDivButtonOk.innerHTML = "Sure, I will take the survey!";
      innerModalDivButtonOk.onclick = function () {
        setCookie('showSurvey', false, 90);
        //Change survey to your survey link.
        window.open(surveyLink, '_blank');
        modalDiv.style.display = 'none';
      }
      var innerModalDivButtonNo = document.createElement('div');
      innerModalDivButtonNo.id = 'btnNo';
      innerModalDivButtonNo.className = 'surveyBtn no';
      innerModalDivButtonNo.innerHTML = "No, thanks.";
      innerModalDivButtonNo.onclick = function () {
        if (dontShowAgain.checked) {
          setCookie('showSurvey', false, 90);
        }
        modalDiv.style.display = 'none';
      }
      innerModalDiv.appendChild(innerModalDivButtonOk);
      innerModalDiv.appendChild(innerModalDivButtonNo);
      //Bottom don't show
      var dontShowAgain = document.createElement('input');
      dontShowAgain.type = 'checkbox';
      dontShowAgain.id = 'dontShowAgain';
      dontShowAgain.name = 'dontShowAgain';
      var dontShowAgainLbl = document.createElement('label');
      dontShowAgainLbl.htmlFor = 'dontShowAgain';
      dontShowAgainLbl.id = 'dontShowAgainLbl';
      dontShowAgainLbl.innerHTML = "Don't show again";
      innerModalDiv.appendChild(document.createElement('hr'));
      innerModalDiv.appendChild(dontShowAgain);
      innerModalDiv.appendChild(dontShowAgainLbl);
      modalDiv.appendChild(innerModalDiv);
      document.getElementsByTagName('body')[0].appendChild(modalDiv);
      //Events
      innerModalDivSpan.onclick = function () {
        modalDiv.style.display = 'none';
        if (dontShowAgain.checked) {
          setCookie('showOSDLSurvey', false, 90);
        }
      }
    }

    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

  };



