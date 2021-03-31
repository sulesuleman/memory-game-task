import React, { useEffect, useState } from "react";
import uuid from "uuid";
import deepcopy from "deepcopy";
import { Row, Col } from 'antd';

import cardImages from "../../cards";

import Card from "../../components/Card/Card";

import Sidebar from '../../container/Sidebar/sidebar';

var fieldWidth = 6;

function shuffleArray(array) {
	return array.sort(() => .5 - Math.random());
}

function generateCards(count) {
	if (count % 2 !== 0)
		throw "Count must be even: 2, 4, 6, etc. but it is " + count;

	const cards = shuffleArray(cardImages)
		.slice(0, count / 2)
		.map(imageURL => ({
			id: uuid.v4(),
			imageURL: process.env.PUBLIC_URL + "/images/cards/" + imageURL,
			isFlipped: false,
			canFlip: true
		}))
		.flatMap(e => [e, { ...deepcopy(e), id: uuid.v4() }]);

	return shuffleArray(cards);
}


export default function Game({ fieldHeight = 2 }) {
	
	var totalCards = fieldWidth * fieldHeight;
	console.log('dsadas', totalCards)

	const [count, setcount ] = useState(0);
	const [tries, setTries] = useState(0);
	const [cards, setCards] = useState(generateCards(totalCards));
	const [canFlip, setCanFlip] = useState(false);
	const [firstCard, setFirstCard] = useState(null);
	const [secondCard, setSecondCard] = useState(null);


	function setCardIsFlipped(cardID, isFlipped) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return { ...c, isFlipped };
		}));
	}

	function setCardCanFlip(cardID, canFlip) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return { ...c, canFlip };
		}));
	}

	// showcase
	useEffect(() => {
		setTimeout(() => {
			let index = 0;
			for (const card of cards) {
				setTimeout(() => setCardIsFlipped(card.id, true), index++ * 100);
			}
			setTimeout(() => setCanFlip(true), cards.length * 100);
		}, 5000);
	}, []);


	function resetFirstAndSecondCards() {
		setFirstCard(null);
		setSecondCard(null);
	}

	function onSuccessGuess() {
		setCardCanFlip(firstCard.id, false);
		setCardCanFlip(secondCard.id, false);
		setCardIsFlipped(firstCard.id, false);
		setCardIsFlipped(secondCard.id, false);
		resetFirstAndSecondCards();
		setcount(count+1);
		setTries(tries+1);
	}
	function onFailureGuess() {
		const firstCardID = firstCard.id;
		const secondCardID = secondCard.id;

		setTimeout(() => {
			setCardIsFlipped(firstCardID, true);
		}, 1000);
		setTimeout(() => {
			setCardIsFlipped(secondCardID, true);
		}, 1200);
		setTries(tries+1);
		resetFirstAndSecondCards();
	}

	useEffect(() => {
		if (!firstCard || !secondCard)
			return;
		(firstCard.imageURL === secondCard.imageURL) ? onSuccessGuess() : onFailureGuess();
	}, [firstCard, secondCard]);


	function onCardClick(card) {
		if (!canFlip)
			return;
		if (!card.canFlip)
			return;

		if ((firstCard && (card.id === firstCard.id) || (secondCard && (card.id === secondCard.id))))
			return;

		setCardIsFlipped(card.id, false);

		(firstCard) ? setSecondCard(card) : setFirstCard(card);
	}

	function parentCallback(childValue) {
		fieldWidth = childValue;
		totalCards = fieldWidth * fieldHeight;
		setCards(generateCards(totalCards));


		console.log(fieldWidth);
	}

	function Restart() {
		setCards(generateCards(totalCards));
		setCanFlip(false);
		setFirstCard(null);
		setSecondCard(null);
		setTimeout(() => {
			let index = 0;
			for (const card of cards) {
				setTimeout(() => setCardIsFlipped(card.id, true), index++ * 100);
			}
			setTimeout(() => setCanFlip(true), cards.length * 100);
		}, 5000);
	}

	return (
		<Row>
			<Col span={18}>
				<div className="game container-md">
					<div className="cards-container">
						{cards.map(card => <Card onClick={() => onCardClick(card)} 
						key={card.id} {...card} />)}
					</div>
				</div>
			</Col>
			<Col span={6}>
				<Sidebar restart={Restart} parentCallback={parentCallback} 
					count={count} total={fieldWidth} tries={tries} 
				/>
			</Col>
		</Row>


	)
}