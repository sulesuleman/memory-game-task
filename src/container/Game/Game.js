import React, { useEffect, useState } from "react";
import uuid from "uuid";
import deepcopy from "deepcopy";
import { Button, Row, Col, List, } from 'antd';

import cardImages from "../../cards";

import Card from "../../components/Card/Card";

import Sidebar from '../../container/Sidebar/sidebar';



var fieldWidth = 6;
window.width = 3;

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

	const [count, setcount] = useState(0);
	const [tries, setTries] = useState(0);
	const [cards, setCards] = useState(generateCards(totalCards));
	const [canFlip, setCanFlip] = useState(false);
	const [onRestart, setonRestart] = useState(false)
	const [firstCard, setFirstCard] = useState(null);
	const [secondCard, setSecondCard] = useState(null);
	const [cardsLength, setCardsLength] = useState(undefined)

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

	useEffect(() => {

		setTimeout(() => {
			let index = 0;
			for (const card of cards) {
				setTimeout(() => { setCardIsFlipped(card.id, true); console.log("timer 1 working") }, index++ * 100);
			}
			setTimeout(() => { setCanFlip(true); console.log("timerr 2 working") }, cards.length * 100);
		}, 5000);
	}, [cardsLength, onRestart]);


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
		setcount(count + 1);
		setTries(tries + 1);
	}

	function onFailureGuess() {
		const firstCardID = firstCard.id;
		const secondCardID = secondCard.id;

		setTimeout(() => {
			setCardIsFlipped(firstCardID, true);
		}, 1000);
		setTimeout(() => {
			setCardIsFlipped(secondCardID, true);
		}, 1000);
		setTries(tries + 1);
		resetFirstAndSecondCards();
	}

	useEffect(() => {
		if (cards && cards.length > 0 && firstCard && secondCard) {

			var firstCardIndex = cards.findIndex(obj => obj.id === firstCard.id);
			var seconCardIndex = cards.findIndex(obj => obj.id === secondCard.id);

		}
		if (!firstCard || !secondCard)
			return;
		if (firstCard.imageURL === secondCard.imageURL) {
			onSuccessGuess();
			console.log("condition true and indexes", firstCardIndex, seconCardIndex);
			let dummyArray = [...cards];
			setCards([]);
			dummyArray[firstCardIndex] = { ...dummyArray[firstCardIndex], imageURL: "https://wallpapercave.com/wp/wp2646216.jpg" };
			dummyArray[seconCardIndex] = { ...dummyArray[seconCardIndex], imageURL: "https://wallpapercave.com/wp/wp2646216.jpg" }
			setCards(dummyArray);


		} else { onFailureGuess(); }
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

	async function parentCallback(childValue) {
		fieldWidth = childValue;
		totalCards = fieldWidth * fieldHeight;
		setCardsLength(totalCards);
		window.width = (fieldWidth * fieldHeight) / 4;
		setCards(generateCards(totalCards));
		await setCanFlip(false);
		console.log({ canFlip })
		setcount(0);
		setTries(0);

	}

	function Restart() {
		setcount(0);
		setTries(0);
		setonRestart(!onRestart);
		setCards(generateCards(totalCards));

		setCanFlip(true);
	}

	return (
		<>
			{
				count === fieldWidth ?
					<div id="overlay" >
						<div id="success-msg">Congratulation! You Won</div>
						<Button className="retry-button" onClick={Restart}> Play Again </Button>
					</div>
					:
					<Row >
						<Col span={18}>
							{/* <div className="game container-md">
								<div className="cards-container">
									{cards.map(card => <Card onClick={() => onCardClick(card)}
										key={card.id} {...card} />)}
								</div>
							</div> */}
							<div className="game container-md">
								<div className="cards-container">
									<List
										grid={{
											gutter: 16,
											xs: 2,
											sm: 3,
											md: 4,
											lg: 4,
											xl: 4,
											xxl: 3,
										}}
										dataSource={cards}
										renderItem={card => (

											<Card onClick={() => onCardClick(card)}
												key={card.id} {...card} />

										)}
									/>
								</div>
							</div>
						</Col>
						<Col span={6}>
							<Sidebar restart={Restart} parentCallback={parentCallback}
								count={count} total={fieldWidth} tries={tries}
							/>
						</Col>
					</Row>
			}

		</>

	)
}