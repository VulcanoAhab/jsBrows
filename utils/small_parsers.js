class ProcessUrls {

  static toFileName(url) {
    var name = url.split('?')[0].split('#')[0];
    if (!(name)) { throw "[-] Fail to parse URL name"}
    name = name
     .replace(/^https?:\/\//, '')
     .replace(/[^A-z0-9]+/g, '-')
     .replace(/-+/g, '-')
     .replace(/^[_\-]+/, '')
     .replace(/[_\-]+$/, '');

     return name + "-" + Date.now();
  }
}

module.exports={
  "ProcessUrls": ProcessUrls
}
