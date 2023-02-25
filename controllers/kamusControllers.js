const {
  collection,
  getCountFromServer,
  query,
  getDocs,
  orderBy,
  where,
  limit,
  startAfter,
} = require("firebase/firestore");
const db = require("../db");

module.exports = {
  all: async (req, res) => {
    try {
      const offset = +req.query.offset || 0;
      const size = +req.query.size || 20;
      let prev = null;
      let next = null;

      const coll = collection(db, "kamus");
      const snapshot = await getCountFromServer(coll);
      const count = snapshot.data().count;

      const q = query(
        collection(db, "kamus"),
        orderBy("id"),
        startAfter(offset),
        limit(size)
      );

      const result = await getDocs(q);
      const data = [];
      result.docs.forEach((doc) => {
        data.push(doc.data());
      });

      if (offset - size >= 0) {
        prev = `${process.env.API_URL}/words/?offset=${
          offset - size
        }&size=${size}`;
      }

      if (offset / size - 1 < Math.floor(count / size)) {
        next = `${process.env.API_URL}/words/?offset=${
          offset + size
        }&size=${size}`;
      }

      res.status(200).send({ count, data, prev, next });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  search: async (req, res) => {
    try {
      const data = [];

      const q = query(
        collection(db, "kamus"),
        where("ind", ">=", req.query.key),
        where("ind", "<=", req.query.key + "\uf8ff")
      );
      const q2 = query(
        collection(db, "kamus"),
        where("kor", ">=", req.query.key),
        where("kor", "<=", req.query.key + "\uf8ff")
      );

      const result = await getDocs(q);
      result.docs.forEach((doc) => {
        data.push(doc.data());
      });

      const result2 = await getDocs(q2);
      result2.docs.forEach((doc) => {
        data.push(doc.data());
      });

      res.status(200).send({ count: result.size + result2.size, data });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  getByBab: async (req, res) => {
    try {
      const data = [];

      const q = query(
        collection(db, "kamus"),
        where("bab", "==", +req.params.bab)
      );

      const result = await getDocs(q);
      result.docs.forEach((doc) => {
        data.push(doc.data());
      });

      res.status(200).send({ count: result.size, data });
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
