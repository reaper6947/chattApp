function checkHttps(req, res, next){
    // protocol check, if http, redirect to https
    
    if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
      console.log("https, yo")
      return next()
    } else {
      console.log("just http")
      res.redirect('https://' + req.hostname + req.url);
    }
}
module.exports = checkHttps;