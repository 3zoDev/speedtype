import { useState, useEffect } from 'react';
import textdata from '../LocalData/data';
import Link from 'next/link';

export default function Home() {
	const [data, setData] = useState('');
	const [charPointer, setCharPointer] = useState(0);
	const [rightPointer, setRightPointer] = useState(0);
	const [wrongChar, setWrongChar] = useState([]);
	const [wrongWord, setWrongWord] = useState([]);
	const [wordPointer, setWordPointer] = useState(0);
	const [time, setTime] = useState(0);
	const [startText, setStartText] = useState(false);
	const [start, setStart] = useState(false);
	const [Wpm, setWpm] = useState(0);
	const [step, setStep] = useState(0);
	const [isFinish, setFinished] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [totalEvent, setTotalEvent] = useState('');
	const [accuracy, setAccuracy] = useState(0);
	const [allTypedEntries, setAllTypedEntries] = useState(0);
	const [isWrong, setWrong] = useState(false);
	var randomProperty = async function () {
		var keys = await Object.keys(textdata);
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
		setInputValue(e.target.value);
		if (e.nativeEvent.inputType !== 'deleteContentBackward') {
			setAllTypedEntries(allTypedEntries + 1);
		}
		if (e.nativeEvent.inputType !== 'deleteContentBackward') {
			setTotalEvent(totalEvent + e.target.value.slice(-1));
			setCharPointer(totalEvent.length + 1);
		}

		if (startText == false) {
			setStartText(true);
			setStart(true);
		}

		if (
			data.slice(0, charPointer + 1) ===
			totalEvent + e.target.value.slice(-1)
		) {
			setRightPointer(totalEvent.length + 1);
			setWrong(false);

			if (e.target.value.slice(-1) === ' ') {
				setWordPointer(wordPointer + 1);
				setInputValue(' ');
			}
			if (rightPointer + 1 === data.length) {
				setStartText(false);
				setStart(false);
				WPM();
				setStep(3);
				setFinished(true);
			}
		} else if (e.nativeEvent.inputType !== 'deleteContentBackward') {
			console.log('it is wrong');
			setWrong(true);
			setWrongChar([...wrongChar, data[charPointer]]);
			if (!wrongWord.includes(data.split(' ')[wordPointer])) {
				setWrongWord([...wrongWord, data.split(' ')[wordPointer]]);
			}
		}
	};

	console
		.log
		// 'totalEvent: ' + totalEvent,
		// 'totalEventLength: ' + totalEvent.length,
		// 'dataSlice: ' + data.slice(0, charPointer),
		// 'dataRight: ' + data.slice(0, rightPointer),
		// 'currentWord: ' + data.split(' ')[wordPointer],
		// 'dataLenght: ' + data.slice(0, charPointer).length,
		// 'RP: ' + rightPointer,
		// 'CP: ' + charPointer,
		// 'WPM: ' + Wpm,
		// 'accurcy: ' + accuracy
		// 'allTypedEntries:' + allTypedEntries
		// 'NatWPM: ' + Wpm
		// 'isWrong: ' + isWrong
		();

	const onDelete = (e) => {
		if (e.key === 'Backspace' && e.target.value.length !== 0) {
			setTotalEvent(totalEvent.slice(0, -1));
			setCharPointer(totalEvent.length - 1);
			if (charPointer == rightPointer) {
				setRightPointer(rightPointer - 1);
			}
		}
	};
	const ResetText = (x) => {
		setCharPointer(0);
		setRightPointer(0);
		setWrongChar([]);
		setWrongWord([]);
		setWordPointer(0);
		setTime(0);
		setStartText(false);
		setStart(false);
		setWpm(0);
		setFinished(false);
		setInputValue('');
		setTotalEvent('');
		setAccuracy(0);
		setAllTypedEntries(0);
		if (x === 'new') {
			setData('');
			randomProperty(textdata);
		}
	};

	const WPM = () => {
		var Accuracy = 0;
		var GrossWPM = 0;
		var NetWPM = 0;
		var sec = Math.floor((time / 1000) % 60);
		var min = Math.floor((time / 60000) % 60);
		var now = ((min * 60 + sec) / 60).toFixed(2);
		GrossWPM = allTypedEntries / 5;
		GrossWPM = GrossWPM / now;
		NetWPM = wrongWord.length / now;
		NetWPM = GrossWPM - NetWPM;
		Accuracy = (NetWPM / GrossWPM) * 100;
		setWpm(Math.round(NetWPM));
		setAccuracy(Math.round(Accuracy));
		console.log(GrossWPM, NetWPM, Accuracy);
	};

	return (
		<div className=" h-screen  bg-gray-100  grid grid-cols-12 max-w-screen gap-4">
			<main className="  w-full text-center  col-start-2 col-span-10 ">
				<nav className="md:grid grid-cols-11 py-5 ">
					<div className="md:flex  hidden space-x-10 col-start-1  flex-row items-center font-semibold ">
						<Link href="/ar">
							<a className="font-cairo">عربي</a>
						</Link>
					</div>
					<span className="col-start-1 uppercase text-4xl font-bold font-houseslant text-gray-700 md:col-start-5 col-span-3 inline">
						speed Writer
					</span>
					<div className="space-x-10 col-start-11 md:flex flex-row items-center font-semibold hidden">
						<a>Login</a>
						<a>Register</a>
					</div>
				</nav>
				<div className="grid grid-cols-11 gap-4 w-full h-auto mt-56">
					{step == 0 ? (
						<>
							<div className="col-start-2 col-span-9 space-y-20">
								<span className="text-left text-2xl font-bold text-gray-600 font-inter ">
									Start testing yourself and{' '}
									<span className="bg-gray-200 underline decoration-lime-400">
										improve
									</span>{' '}
									your typing skils.
								</span>
								<button
									className="block uppercase mx-auto shadow bg-red-400  focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded font-inter"
									onClick={() => setStep(1)}
								>
									Start
								</button>
							</div>
						</>
					) : (
						<div className="col-start-1 col-span-11 space-y-10  w-full leading-10 h-auto pb-36">
							<div className="flex flex-row justify-between">
								{!isFinish ? (
									<>
										<button
											className="block uppercase font-cairo focus:shadow-outline focus:outline-none text-green-600 text-xs py-3  rounded font-bold"
											onClick={() => {
												ResetText('new');
											}}
										>
											Change
										</button>
										<span className="flex flex-col justify-center items-center text-left text-lg font-bold  text-gray-500 font-cairo">
											<span>
												{Math.floor((time / 60000) % 60)}:
												{Math.floor((time / 1000) % 60)}
											</span>
										</span>
									</>
								) : null}
							</div>
							<div className="w-full h-auto text-left ">
								<span className="text-2xl font-bold text-gray-600 font-inter">
									{data.split('').map((i, x) => {
										if (x < charPointer) {
											if (x < rightPointer) {
												return (
													<span className="bg-gray-200 underline decoration-lime-400 ">
														{i}
													</span>
												);
											} else {
												return (
													<span className="text-red-400 bg-gray-200 underline decoration-red-400">
														{i}
													</span>
												);
											}
										} else {
											return <span>{i}</span>;
										}
									})}
								</span>
							</div>
							{!isFinish ? (
								<div className="w-full flex justify-center items-center ">
									<input
										value={inputValue}
										placeholder="Go"
										onChange={onType}
										ref={(input) => input && input.focus()}
										onKeyDown={onDelete}
										className={`px-4 py-2 rounded-lg border border-gray-300 ${
											isWrong
												? 'border-red-300 focus:ring-red-300'
												: 'border-green-300 focus:ring-green-300'
										} focus:outline-none focus:ring-2  w-1/2`}
									/>
								</div>
							) : (
								<div className="flex flex-col space-y-32 w-full justify-start items-center">
									<div className="flex flex-row space-x-20">
										<span className="text-left text-2xl font-bold text-gray-600 font-inter">
											WPM: {Wpm}
										</span>
										<span className="text-left text-2xl font-bold text-gray-600 font-inter">
											Accuracy: %{accuracy}
										</span>
										<span className="text-left text-2xl font-bold text-gray-600 font-inter">
											Time: {Math.floor((time / 60000) % 60)}:
											{Math.floor((time / 1000) % 60)}
										</span>
									</div>
									<div className="flex flex-row mx-auto space-x-32">
										<button
											className="block uppercase  shadow bg-red-400 font-inter  focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded font-bold w-32"
											onClick={() => {
												ResetText();
											}}
										>
											Repeat
										</button>
										<button
											className="block uppercase  shadow bg-green-400 font-inter  focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded font-bold  w-32"
											onClick={() => {
												ResetText('new');
											}}
										>
											New
										</button>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
