// const idRoot = "A7mUJTeNaiTmJWk8HKjo"; // change to prod
const idRoot = "A7mUJTeNaiTmJWk8HKjo";

const collectionsTest = {
  posts: "testPosts",
  channels: "testChannels",
  traceUserStars: "testTraceUserStars",
  traceUserBooks: "testTraceUserBooks",
  traceUserComments: "testTraceUserComments",
  comments: "testComments",
  accounts: "testAccounts",
  notifications: "testNotifications",
  competencyUser: "testCompetencyUser",
};

const storageTest = {
  articles: "testArticles",
  photos: "testPhotos",
};

const collectionsProd = {
  posts: "posts",
  channels: "channels",
  traceUserStars: "traceUserStars",
  traceUserBooks: "traceUserBooks",
  traceUserComments: "traceUserComments",
  comments: "comments",
  accounts: "accounts",
  notifications: "notifications",
  competencyUser: "competencyUser",
};

const storageProd = {
  articles: "articles",
  photos: "photos",
};

const stateCollections = collectionsTest;
const stateStorage = storageTest;

const firebaseConfig = {
  apiKey: "AIzaSyD29hxSTwTWZhpKG315tda47fy2HOny2v8",
  authDomain: "locus-68ed2.firebaseapp.com",
  databaseURL: "https://locus-68ed2-default-rtdb.firebaseio.com",
  projectId: "locus-68ed2",
  storageBucket: "locus-68ed2.appspot.com",
  messagingSenderId: "345502863205",
  appId: "1:345502863205:web:4ef77dd654c77c24c39b8c",
  measurementId: "G-N5HJXWCHME",
};

export { stateCollections, idRoot, stateStorage, firebaseConfig };
