import React from 'react';

const rules = () => {
  return (
    <div>
      <h1>Rules</h1>
      <h2>Object of the game</h2>
      <p>
        You get to select two managers per league before their league drafts.
        Earn points based on their division and their Points For and Wins.
      </p>
      <h2>How scores are calculated</h2>
      <p>
        There will be two leaderboards: a points for leaderboard and a wins
        leaderboard.
      </p>
      <h3>Points For Scoring</h3>
      <ul>
        <li>D1 - 3x points scored for each manager you picked</li>
        <li>D2 - 2x points scored for each manager you picked</li>
        <li>D3 - 1x points scored for each manager you picked</li>
      </ul>
      <p>Highest cumulative score wins.</p>
      <h3>Wins Scoring</h3>
      <ul>
        <li>D1 - 3 points for every win for each manager you picked</li>
        <li>D2 - 2 points for every win for each manager you picked</li>
        <li>D3 - 1 points for every win for each manager you picked</li>
      </ul>
      <p>Highest cumulative score wins.</p>
    </div>
  );
};

export default rules;
