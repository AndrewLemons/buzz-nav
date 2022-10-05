import Database from "@buzz-nav/database";
import Router from "@buzz-nav/router";

const db = new Database();
const router = new Router(db);

let nodeString = `33.77546, -84.39871
33.77402, -84.39787
33.77494, -84.39836
33.77472, -84.39885
33.77458, -84.39884
33.77459, -84.39852
33.77402, -84.39851
33.7752, -84.39779
33.77402, -84.3978
33.77519, -84.39685
33.774, -84.39686
33.77398, -84.39602
33.7755, -84.39917
33.77608, -84.39917
33.77613, -84.40018
33.77594, -84.40078
33.77474, -84.39997
33.77646, -84.40008
33.77665, -84.40114
33.77729, -84.40239
33.77728, -84.40421
33.77458, -84.39914`;

let nodes = [];

nodes.push(db.node.createNode(0, 0, 1));

nodeString.split("\n").forEach((node) => {
	let [lat, lon] = node.split(", ");
	nodes.push(db.node.createNode(parseFloat(lon), parseFloat(lat), 1));
});

db.path.createPath(nodes[21], nodes[20]);
db.path.createPath(nodes[20], nodes[19]);
db.path.createPath(nodes[19], nodes[18]);
db.path.createPath(nodes[19], nodes[16]);
db.path.createPath(nodes[18], nodes[15]);
db.path.createPath(nodes[16], nodes[15]);
db.path.createPath(nodes[16], nodes[17]);
db.path.createPath(nodes[15], nodes[14]);
db.path.createPath(nodes[18], nodes[14]);
db.path.createPath(nodes[14], nodes[13]);
db.path.createPath(nodes[13], nodes[1]);
db.path.createPath(nodes[14], nodes[1]);
db.path.createPath(nodes[13], nodes[4]);
db.path.createPath(nodes[13], nodes[4]);
db.path.createPath(nodes[17], nodes[22]);
db.path.createPath(nodes[22], nodes[4]);
db.path.createPath(nodes[22], nodes[5]);
db.path.createPath(nodes[4], nodes[3]);
db.path.createPath(nodes[5], nodes[6]);
db.path.createPath(nodes[22], nodes[5]);
db.path.createPath(nodes[6], nodes[7]);
db.path.createPath(nodes[22], nodes[5]);
db.path.createPath(nodes[7], nodes[2]);
db.path.createPath(nodes[2], nodes[9]);
db.path.createPath(nodes[9], nodes[11]);
db.path.createPath(nodes[11], nodes[12]);
db.path.createPath(nodes[11], nodes[10]);
db.path.createPath(nodes[10], nodes[8]);
db.path.createPath(nodes[8], nodes[3]);
db.path.createPath(nodes[1], nodes[3]);
db.path.createPath(nodes[3], nodes[2]);
db.path.createPath(nodes[9], nodes[8]);

router
	.findRoute(nodes[21], nodes[12])
	.getNodes()
	.forEach((node) => {
		console.log(node.toString());
	});
