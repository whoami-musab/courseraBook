export const notFound = (req, res, next)=>{
    res.status(404)
    return res.render('404');
}

export const handleError = (err, req, res, next)=>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    if(req.accepts('json')){
        return res.json({message: err.message})
    }
    if(statusCode === 500){
        return res.render('500', {message: err.message})
    }
    return res.render('error', {message: err.message})
}