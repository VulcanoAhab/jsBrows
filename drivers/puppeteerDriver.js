const puppeteer = require("puppeteer");


_DEFAULT_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) \
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36"

_DEAFULT_ARGS=[
    '--no-sandbox',
    '--disable-web-security',
    '--lang=en-US,en'
  ]


class Browser {
  constructor(headless=true,
              executablePath="",
              userAgent=_DEFAULT_AGENT,
              browserArgs=_DEAFULT_ARGS
              ) {
  this.userAgent=userAgent;
  this.browserArgs=browserArgs;
  this.headless=headless;
  this.executablePath=executablePath;

 }

 async buildBrowser () {
   var launchObj={
     "headless":this.headless,
      "args":this.browserArgs,
   }
   if (this.executablePath) {
     console.log(`[+] Changing executable path ${this.executablePath}`);
     launchObj["executablePath"]=this.executablePath;
   }
  this.browser = await puppeteer.launch(launchObj);
  this.working_page=await this.browser.newPage();
  this.working_page.setViewport({ width:1200, height:780 });
  this.working_page.setUserAgent(this.userAgent);
 }

async get(target_url) {
 await this.working_page.goto(target_url,
   {waitUntil:"domcontentloaded", timeout: 300000});
}

async xpath(pattern, property=""){
  var results=[];
  var targetHandle=await this.working_page.$x(pattern);
  if (!(targetHandle)){return no_results}
  if (Array.isArray(targetHandle)) {
    if (!(property)) {
        results=targetHandle;
      } else {
        var elements=await Promise.all(
        targetHandle.map(handle => handle.getProperty(property)));
        results=await Promise.all(elements.map(el => el.jsonValue()));
      }
  } else {
  if (!(property)) {
    results=[targetHandle];
  } else {
    var element=await targetHandle.getProperty(property);
    results=[await element.jsonValue()]
    }
  }
  return results
}

async screenshot(imageNamePath){
  if (imageNamePath.indexOf(".png") < 0){
    console.log("[-] Need to be PNG image");
    return
  }
  await this.working_page.screenshot({path: imageNamePath, fullPage: true});
}

async close(){
  await this.browser.close();
}

} //Browser Class

module.exports = {"Browser":Browser};
