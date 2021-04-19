let ws = require('ws')
var server = new ws.Server({port:3000});

var db = new Map();
db.set('count', 0);

server.on('connection', ws => {
	let cid = db.get('count');
	db.set('count', cid+1);

	console.log(cid);
	// console.log(server);

	ws.on('message', message => {
		console.log(message);

		let obj = JSON.parse(message);

		switch (obj.com) {
			case 'room-check':
				if (!db.has(obj.room)) {
					ws.send(JSON.stringify({com:"room-error"}));
				}
				break;

			case 'room':
				if (!db.has(obj.room)) {
					db.set(obj.room, {
						member:[{id:obj.id, name:obj.name, cid:cid, card:0}],
						connect: [ws],
					});
					ws.send(JSON.stringify({com:"room-success", room:obj.room}));
				} else {
					ws.send(JSON.stringify({com:"room-error"}));
				}
				break;

			case 'join':
				if (db.has(obj.room)) {
					let r = db.get(obj.room);
					let mem = r.member.push({id:obj.id, name:obj.name, cid:cid, card:0});
					let con = r.connect.push(ws);
					db.set(obj.room, r);
					console.log(r.member);	
					ws.send(JSON.stringify({com:"room-success", room:obj.room}));
				} else {
					ws.send(JSON.stringify({com:"room-error"}));
				}
				break;

			case 'card':
				console.log("card >"+obj.room);
				if (db.has(obj.room)) {
					console.log(db);
					let ms = db.get(obj.room).member;
					let fm = ms.find((m) => m.id == obj.id);
					fm.card = obj.card;	
				}
				break;

			case 'open':
				break;

			case 'restart':
				if (db.has(obj.room)) {
					let m = db.get(obj.room).member;
					m.forEach(val => {
						val.card = 0;
					});
				}
				break;
		}

		// console.log(db);

		// クライアントにデータを返信
		if (db.has(obj.room)) {
			let m = db.get(obj.room).member;
			db.get(obj.room).connect.forEach(client => {
				client.send(JSON.stringify({com:obj.com, member:m}));
			});
		}
	});
	ws.on('close', (event) => {
		console.log('close');
		// console.log(event);
		console.log('cid='+cid);

		let room = "";
		// ws削除

		// idを検索して消す
		// 残ったメンバーに状態を送る
		let found_key = "";
		let found = -1;
		db.forEach(function(value, key, index_1) {
			console.log(key, value);
			// found_key = key;
			if (key != "count") {
				let con = value.connect.findIndex(ele => ele == ws);
				if (con >= 0) {
					value.connect.splice(con, 1);
					room = key;
				}

				let res = value.member.findIndex(ele => ele.cid == cid);
				if (res >= 0) {
					if (value.member[res].ws == ws) {
						console.log("ws same!!!");
					}
					value.member.splice(res, 1);
				}
				if (value.member.length == 0) {
					db.delete(key);
				}
				console.log("res=>");
				console.log(res);
			}
		});
		console.log("room="+room);
		// クライアントにデータを返信
		if (room != "") {
			if (db.has(room)) {
				let member = db.get(room).member;
				db.get(room).connect.forEach(client => {
					console.log("send to > ");
					console.log(member);
					client.send(JSON.stringify({com:"close", member:member}));
				});	
			}
		}
	});
});