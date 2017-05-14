// require dependincies 
var express = require('express');
var router = express.Router();
var userController = require('./controllers/userController');
var portfolioController = require('./controllers/portfolioController');
var workController = require('./controllers/workController');

// add routes


router.get('/register', userController.register);

router.post('/register', userController.createUser);


router.get('/login', userController.login);

router.post('/login', userController.authenticate);


router.get('/edit-info', userController.checkAuth, userController.editInfo);
router.post('/edit-info', userController.checkAuth, userController.updateInfo);


router.get('/create-portfolio', userController.checkAuth, portfolioController.createPortfolio);
router.post('/create-portfolio', userController.checkAuth, portfolioController.storePortfolio);

router.get('/portfolio/:id', portfolioController.viewPortfolio);

router.get('/portfolio', userController.checkAuth, portfolioController.viewMyPortfolio);



router.get('/edit-portfolio', userController.checkAuth, portfolioController.editPortfolio);
router.post('/edit-portfolio', userController.checkAuth, portfolioController.updatePortfolio);


router.get('/add-work', userController.checkAuth, workController.addWork);
router.post('/add-work', userController.checkAuth, workController.storeWork);

router.get('/works/:id/edit', userController.checkAuth, workController.editWork);
router.post('/works/:id/edit', userController.checkAuth, workController.updateWork);

router.get('/works/:id/remove', userController.checkAuth, workController.removeWork);

router.get('/works/:id1/images/:id2/remove', userController.checkAuth, workController.removeImage);

router.get('/works/:id', workController.viewWork);

router.get('/home/:page', userController.home);

router.get('/home', userController.index);


router.get('/search/:keyword/:page', userController.searchPaging);
router.get('/search/:keyword', userController.search);


//logout
router.get('/logout', userController.checkAuth, userController.logout);

router.get('/', userController.welcome);


// export router

module.exports = router;
