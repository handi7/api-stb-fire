const {
  collection,
  getCountFromServer,
  query,
  orderBy,
  getDocs,
  where,
  startAfter,
  limit,
} = require("firebase/firestore");
const { API_URL } = require("../constants");
const db = require("../db");

module.exports = {
  all: async (req, res) => {
    try {
      const offset = +req.query.offset || 0;
      const size = +req.query.limit || 20;
      let prev = null;
      let next = null;

      const coll = collection(db, "sinonim");
      const snapshot = await getCountFromServer(coll);
      const count = snapshot.data().count;

      const q = query(
        collection(db, "sinonim"),
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
        prev = `${API_URL}/synonyms/?offset=${offset - size}&limit=${size}`;
      }

      if (offset / size < Math.floor(count / size)) {
        next = `${API_URL}/synonyms/?offset=${offset + size}&limit=${size}`;
      }

      res.status(200).send({ count, data, prev, next });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  search: async (req, res) => {
    try {
      const { key } = req.query;
      const data = [];
      const fields = ["kor", "ind"];

      const getQuery = (field) => {
        return query(
          collection(db, "sinonim"),
          where(field, ">=", key || ""),
          where(field, "<=", key + "\uf8ff")
        );
      };

      if (key) {
        await Promise.all(
          fields.map(async (field) => {
            const result = await getDocs(getQuery(field));
            result.docs.forEach((doc) => {
              data.push(doc.data());
            });
          })
        );
      }

      res.status(200).send({ count: data?.length, data });
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
