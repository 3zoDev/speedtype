import { useState, useEffect } from 'react';
import textdata from '../LocalData/data';
export default function Home() {
	const [data, setData] = useState('');
	const [charPointer, setCharPointer] = useState(0);
	const [rightPointer, setRightPointer] = useState(0);
	const [time, setTime] = useState(0);
	const [start, setStart] = useState(false);
	const [startText, setStartText] = useState(false);
	const [Wpm, setWpm] = useState(0);

	var randomProperty = function () {
		var keys = Object.keys(textdata);
		setData(textdata[keys[(keys.length * Math.random()) << 0]]);
	};

	useEffect(() => {
		randomProperty(textdata);
	}, []);
	useEffect(() => {
		let interval = null;

		if (start) {
			interval = setInterval(() => {
				setTime((prevTime) => prevTime + 10);
			}, 10);
		} else {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [start]);

	const onType = (e) => {
		if (startText == false) {
			setStartText(true);
			setStart(true);
		}
		if (
			data.length === data.slice(0, rightPointer + 1).length &&
			start == true
		) {
			setStartText(false);
			setStart(false);
			WPM();
		}
		setCharPointer(e.target.value.length);
		if (data.slice(0, charPointer + 1) === e.target.value) {
			setRightPointer(e.target.value.length);
		}
	};

	const onDelete = (e) => {
		if (e.key === 'Backspace' && e.target.value.length !== 0) {
			setCharPointer(e.target.value.length - 1);

			if (charPointer == rightPointer) {
				setRightPointer(rightPointer - 1);
			}
		}
	};
	const WPM = () => {
		var wpm = 0;
		var sec = Math.floor((time / 1000) % 60);
		var min = Math.floor((time / 60000) % 60);
		var now = (min * 60 + sec) / 60;
		wpm = data.length / 5;
		wpm = wpm / now;
		setWpm(Math.round(wpm));
	};
	// console.log('CP: ' + charPointer, 'RP: ' + rightPointer);
	// console.log(
	// 	'CP: ' + data.slice(0, charPointer),
	// 	'RP: ' + data.slice(0, rightPointer)
	// );
	// console.log(start);

	return (
		<div className="flex flex-col items-center h-screen py-2 bg-gray-100">
			<main className="h-full items-center justify-center w-full text-center flex flex-col ">
				<span className="p-4 text-6xl font-bold font-houseslant text-gray-700">
					Speed Type
				</span>
				<div className="flex flex-col justify-center items-center max-w-screen-lg h-full space-y-20">
					<div className="text-left text-2xl font-bold text-gray-400 font-inter">
						<span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
						<span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
					</div>
					<span className="text-left text-2xl font-bold text-gray-600 font-inter">
						{data.split('').map((i, x) => {
							if (x < charPointer) {
								if (x < rightPointer) {
									return (
										<span className="text-green-400 bg-gray-200 border-b-2 border-green-400">
											{i}
										</span>
									);
								} else {
									return (
										<span className="text-red-400 bg-gray-200 border-b-2 border-red-400">
											{i}
										</span>
									);
								}
							} else {
								return <span>{i}</span>;
							}
						})}
					</span>

					<div className="w-full ">
						<input
							placeholder="Go"
							onChange={onType}
							ref={(input) => input && input.focus()}
							onKeyDown={onDelete}
							className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full"
						/>
					</div>
					<div>{Wpm}</div>
				</div>
			</main>
		</div>
	);
}
