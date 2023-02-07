import {colorValue, project} from './report.component';

export function printDiv(divId: string) {
  const css = `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
  integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">`;
  
  const printContents = document.getElementById(divId).innerHTML;
  const pageContent = `
      <!DOCTYPE html>
      <html lang="" style="margin: 20px">
      <head>
      <style>
        *, html {
          font-family: 'Source Sans Pro', sans-serif;
        }
        .body-content {
          display: flex;
          margin: 20px 30px 0 20px;
          justify-content: space-between;
          height: 280px;
        }
        .chart, .chart2 {
          padding: 30px;
          display: flex;
          justify-content: center;
          transition: all 0.5s ease-in-out;
          border-radius: 20px;
          box-shadow: 0 1px 22px -12px #607D8B;
          margin: 10px;
          align-items: center;
        }
        .chart-wrapper {
          height: 280px;
        }
      </style>
      <title></title>
        ${css}
      </head>
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
         <p style="font-weight: 500; font-size: 13px; color: #C2C2C2; font-style: italic; margin: 0; padding: 0;">
            <script>
                  let mydate = new Date();
                  let day = mydate.getDay();
                  let month = mydate.getMonth();
                  let year = mydate.getFullYear();
                  let d = mydate.getDate();
                  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                
                  document.write(monthNames[month] + " " + d + ', ' + year)
              </script>
              </p>
      </h2>
      <div style="
      margin: 20px auto 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%">${printContents}</div>
      </body>
      </html>`;
  
  let popupWindow: Window;
  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    popupWindow = window.open(
      '',
      '_blank',
      'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
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
    popupWindow = window.open('', '_blank', 'width=600,height=600');
    popupWindow.document.open();
    popupWindow.document.write(pageContent);
    popupWindow.document.close();
  }
  
}
