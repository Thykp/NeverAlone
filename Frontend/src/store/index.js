import { createStore } from 'vuex';
import axios from 'axios';
const base_url = import.meta.env.VITE_ENDPOINT ?? `http://localhost:${import.meta.env.VITE_PORT}`;

const store = createStore({
  state() {
    return {
      user: {},
      populateMatches: [],
      matchedUsers: [],
      matchNotification: null,
      selectedMatchUid: null,
      isLoading: false,
      score: false,
      isWinner: false,
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getPopulateMatches(state) {
      return state.populateMatches;
    },
    getMatchedUsers(state) {
      return state.matchedUsers;
    },
    getMatchNotification(state) {
      return state.matchNotification;
    },
    isLoading: state => state.isLoading,
    getScore: state => state.score,
    isWinner: (state) => state.isWinner,
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    },
    setPopulateMatches(state, populateMatchesData) {
      state.populateMatches = populateMatchesData;
    },
    setMatchNotification(state, matchData) {
      state.matchNotification = matchData;
    },
    clearMatchNotification(state) {
      state.matchNotification = null;
    },
    setMatchedUsers(state, matchedUsersData) {
      state.matchedUsers = matchedUsersData;
    },
    setSelectedMatchUid(state, uid) {
      state.selectedMatchUid = uid;
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setWinnerStatus(state, isWinner) {
      state.isWinner = isWinner;
    },
    addLikeToUser(state, likedUser) {
      if (!state.user.likes) {
        state.user.likes = [];
      }
      state.user.likes.push({
        name: likedUser.name,
        uid: likedUser.id,
      });
    },
    addDislikeToUser(state, dislikedUser) {
      if (!state.user.dislikes) {
        state.user.dislikes = [];
      }
      state.user.dislikes.push({
        name: dislikedUser.name,
        uid: dislikedUser.id,
      });
    },
    setQuizComplete(state, score){
      state.score = score
    }
  },
  actions: {    
    async fetchMatches({ commit }, uid) {
      try {
        const response = await axios.get(`${base_url}/user/${uid}`);
        const userData = { ...response.data, uid }
        console.log(userData)
        commit('setUser', userData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    },

    async populateMatches({ commit }, uid) {
      try {
          commit("setIsLoading", true);
          const response = await axios.post(`${base_url}/user/populate_homepage/${uid}`);
          console.log(response.data)
          commit('setPopulateMatches', response.data);
          commit("setIsLoading", false);
      } catch (error) {
          console.error("Failed to fetch populateMatches data:", error);
      }
    },

    async likeUser({ commit }, { uid, likedUserId }) {
      try {
        console.log(likedUserId);
        const response = await axios.post(`${base_url}/user/like/${uid}/${likedUserId}`);
        
        if (response.status === 200) {
          commit('addLikeToUser', { uid: likedUserId });
        }
      } catch (error) {
        console.error("Failed to like user:", error);
      }
    },

    async dislikeUser({ commit }, { uid, dislikedUserId }) {
      try {
        console.log(dislikedUserId);
        const response = await axios.post(`${base_url}/user/dislike/${uid}/${dislikedUserId}`);
        
        if (response.status === 200) {
          commit('addDislikeToUser', { uid: dislikedUserId });
        }
      } catch (error) {
        console.error("Failed to dislike user:", error);
      }
    },

    async likeUser({ commit }, { uid, likedUserId }) {
      try {
        const response = await axios.post(`${base_url}/user/like/${uid}/${likedUserId}`);
        
        if (response.status === 200) {
          commit('addLikeToUser', { uid: likedUserId });
          
          if (response.data === 'Match created') {
            const matchedUserData = { uid: likedUserId, name: response.data.name };
            commit('setMatchNotification', matchedUserData);
          }
        }
      } catch (error) {
        console.error("Failed to like user:", error);
      }
    },

    async fetchMatchedUsers({ commit }, uid) {
      try {
        const response = await axios.get(`${base_url}/user/matches/${uid}`);
        const userData = response.data;
        const matchedUsers = userData || [];
        commit('setMatchedUsers', matchedUsers);
      } catch (error) {
        console.error("Failed to fetch matched users:", error);
      }
    },

    async startQuiz({ commit }, { matchUid }) {
      commit("setSelectedMatchUid", matchUid);
      commit("setQuizComplete", false);
    },
  
    async saveScore({ state, commit, dispatch }, { userUid, matchUid, score }) {
      try {
        if (userUid) {
          console.log(score);
          await axios.post(`${base_url}/user/saveScore/${userUid}/${matchUid}/${score}`);
          commit("setQuizComplete", true);
    
          const { data: bothCompleted } = await axios.get(`${base_url}/user/checkMatchCompletion/${matchUid}`);
          console.log(bothCompleted);
          if (bothCompleted) {
            console.log("Both players completed the quiz");
            const { data: winnerData } = await axios.get(`${base_url}/user/getMatchWinner/${userUid}/${matchUid}`);
            console.log(winnerData);
            commit("setWinnerStatus", winnerData.winnerUid === userUid);
          } else {
            console.log("Waiting for the other player to complete the quiz");
          }
        } else {
          console.error("User UID is undefined");
        }
      } catch (error) {
        console.error("Error saving score:", error);
      }
    },
  
    sendWinnerImage({ state, dispatch }) {
      // Action to trigger the image sending functionality
      dispatch("photoSent");
    },

    clearMatchNotification({ commit }) {
      commit('setMatchNotification', null);
    },

    selectMatch({ commit }, uid) {
      commit('setSelectedMatchUid', uid);
    },

    completedQuiz({ commit }) {
      commit('setQuizComplete', true);
    },
    photoSent({ commit }) {
      commit('setQuizComplete', false);
    }
  }
});

export default store;
