const { async } = require("@firebase/util");
const {
  collection,
  getCountFromServer,
  query,
  orderBy,
  getDocs,
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

      const coll = collection(db, "antonim");
      const snapshot = await getCountFromServer(coll);
      const count = snapshot.data().count;

      const q = query(
        collection(db, "antonim"),
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
        prev = `${process.env.API_URL}/antonyms/?offset=${
          offset - size
        }&size=${size}`;
      }

      if (offset / size < Math.floor(count / size)) {
        next = `${process.env.API_URL}/antonyms/?offset=${
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
      const fields = ["kor1", "kor2", "ind1", "ind2"];

      const getQuery = (field) => {
        return query(
          collection(db, "antonim"),
          where(field, ">=", req.query.key),
          where(field, "<=", req.query.key + "\uf8ff")
        );
      };

      await Promise.all(
        fields.map(async (field) => {
          const result = await getDocs(getQuery(field));
          result.docs.forEach((doc) => {
            data.push(doc.data());
          });
        })
      );

      res.status(200).send({ count: data?.length, data });
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
