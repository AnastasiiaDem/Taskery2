import {colorValue, project} from './report.component';

export function printDiv(divId: string) {
  const css = `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
  integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">`;
  
  const printContents = document.getElementById(divId).innerHTML;
  const pageContent = `
     <!doctype html>
<html lang="en" style="margin: 20px">
<head>
  <meta charset="utf-8">
  <title>Taskery</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">
  <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg">
  <link rel="icon" type="image/png" href="/assets/images/favicon.png">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
      href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap"
      rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <style>
        *, html {
          font-family: 'Source Sans Pro', sans-serif;
        }
        .body-content {
          display: flex;
          margin: 0 30px 0 20px;
          justify-content: space-between;
          height: 350px;
        }
        
        .chart, .chart2, .block1, .block2, .block3 {
          width: 40%;
          padding: 30px;
          display: flex;
          justify-content: center;
          transition: all 0.5s ease-in-out;
          border-radius: 20px;
          box-shadow: 0 1px 22px -12px #607D8B;
          margin: 7px;
          align-items: center;
        }
        
        .date-block {
          display: flex;
          flex-direction: column;
        }
        
        .date-block-wrapper {
          padding: 10px;
          display: flex;
          justify-content: center;
          transition: all 0.5s ease-in-out;
          border-radius: 20px;
          box-shadow: 0 1px 22px -12px #607D8B;
          margin: 7px;
          align-items: center !important;
          height: 65px !important
        }
        
        .chart2 {
          width: 60%;
        }
        
        .block1, .block2, .block3, .block4 {
          width: 25%;
        
          img {
            height: 70px;
          }
        
          p {
            font-family: "Source Sans Pro", sans-serif;
            text-anchor: start;
            dominant-baseline: auto;
            font-size: 20px;
            font-weight: 700;
            color: rgb(55, 61, 63);
            margin-bottom: 0;
          }
        }
        
        .info-data {
          font-size: 45px !important;
          font-weight: 900 !important;
        }
        
        .block1 {
          width: 220px;
        }
        
        .block2 {
          width: 290px;
        }
        
        .block3 {
          width: 400px;
        }
        
        .block4 {
          width: 180px;
        
          .date {
            font-size: 15px;
            font-weight: 500;
          }
        }
        
        .info-img-block {
          background: rgba(88, 227, 128, 0.2);
          border-radius: 100%;
          padding: 40px;
          filter: blur(4px);
        }
        
        .info-img {
          position: absolute;
          bottom: 10px;
          left: 12px;
        }
        
        .chart-wrapper {
          width: 100%;
          height: 100%;
        }
        
        .info-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .dist {
          text-align: center;
        }
        
        .btn {
          line-height: 1rem !important;
        }
        
        .w3-animate-opacity {
          margin: 3rem auto 1rem auto;
          width: 95%;
        }
        
        .no-content {
          font-family: 'Libre Baskerville', serif !important;
          height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        
          p {
            color: rgb(0 0 0 / 40%);
            text-align: center;
            position: relative;
            margin-bottom: 0;
          }
        
          .no-data-image img {
            position: absolute;
            width: 40%;
            z-index: -1;
            top: 8%;
            left: 30%;
          }
        }
        
        .panel-body {
          max-height: 450px;
          padding: 10px 0 20px 0;
          width: 100%;
          overflow-y: scroll;
          overflow-x: hidden;
        }
        
        .btn {
          transition: 0.5s;
        }

      </style>
       ${css}
      </head>
<script src="https://kit.fontawesome.com/7baa072388.js" crossorigin="anonymous"></script>
<script src="https://fastly.jsdelivr.net/npm/echarts@5.4.1/dist/echarts.min.js"></script>
<body onload="window.print()" style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 20px 20px 0;
      ">
      <div style="
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      ">
        <h1 style="
              font-weight: 700;
              width: 100%;
              text-align: left;
              padding-bottom: 10px;
              color: #373d3f;
              ">
        <hr style="
        width: 100px;
        height: 3px;
        margin: 0 0 -5px 0;
        background-color: ${colorValue};
        border: 0 none;
        border-radius: 10px;
        "/>
          PROJECT <p style="color: ${colorValue}; display: inline-block; padding: 0; margin: 0;">DASHBOARD</p>
        </h1>
      <p style="
            width: 100px;
            color: ${colorValue};
            font-weight: 700;
        ">
          ${project.status}
        </p>
      </div>
      <h2 style="
        font-weight: 900;
        width: 100%;
        text-align: center;
        color: #373d3f;
      ">
      ${project.projectName}
      </h2>
      
      <div style="
      margin: 20px auto 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%">
${printContents}
      </div>
  </body>
</html>`;
  
  
  let popupWindow: Window;
  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    popupWindow = window.open(
      '',
      '_blank',
      'width=1200,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
    );
    popupWindow.window.focus();
    popupWindow.document.write(pageContent);
    popupWindow.document.close();
    popupWindow.onbeforeunload = event => {
      popupWindow.close();
    };
    popupWindow.onabort = event => {
      popupWindow.document.close();
      popupWindow.close();
    };
  } else {
    popupWindow = window.open('', '_blank', 'width=1200,height=600');
    popupWindow.document.open();
    popupWindow.document.write(pageContent);
    popupWindow.document.close();
  }
  
}
