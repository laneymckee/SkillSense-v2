const express = require('express');
const pool = require('../modules/pool');
const {
	rejectUnauthenticated
} = require('../modules/authentication-middleware');
const router = express.Router();

//GET ROUTE of skills for logged in user or user passed as params
router.get('/', rejectUnauthenticated, (req, res) => {
	const queryText = `SELECT
		"skill_tags".id,
		"skill_tags".tag
	FROM
		"user_tags"
	JOIN
		"skill_tags"
	on
		"user_tags".tag_id = "skill_tags".id
	WHERE
		"user_tags".user_id = $1
	ORDER BY id DESC;`;
	//uses the current logged in user if no user is passed
	const userId = req.query.id || req.user.id
	pool.query(queryText, [userId])
		.then(result => {
			res.send(result.rows);
		})
		.catch(error => {
			console.log('Error in GET of skills for logged in user',error);
			res.sendStatus(500);
		});
});


// POST route of new skill into users list of skills
router.post('/', rejectUnauthenticated, (req, res) => {
	const userId = req.user.id;
	const tagId = req.body.id;
	const sqlText = `INSERT
        INTO "user_tags"
            (tag_id, user_id)
        VALUES
            ($1, $2);`;
	pool.query(sqlText, [tagId, userId])
		.then(result => {
			res.sendStatus(200);
		})
		.catch(error => {
			console.log('Error on adding user skill into db: ', error);
			res.sendStatus(500);
		});
});

//DELETE route of skill from user's list of skills
router.delete('/:id', rejectUnauthenticated, (req, res) => {
	const tagId = req.params.id;
	const userId = req.user.id;
	const sqlText = `DELETE
        FROM "user_tags"
        WHERE (tag_id = $1) AND (user_id = $2);`;
	pool.query(sqlText, [tagId, userId])
		.then(result => {
			res.sendStatus(204);
		})
		.catch(error => {
			console.log('Error on deleting user skill from db: ', error);
			res.sendStatus(500);
		});
});

module.exports = router;
