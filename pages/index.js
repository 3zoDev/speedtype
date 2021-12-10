import { useState, useEffect } from 'react';
import textdata from '../LocalData/data';
import Link from 'next/link';

export default function Home() {
	// متغير لتخزين القطع النصيه
	const [data, setData] = useState('');

	// مؤشر عام لمتابعه عدد المدخلات ومقارنتها بالحرف المقابل في القطعه النصيه
	const [charPointer, setCharPointer] = useState(0);

	// مؤشر لمتابعة الاحرف المدخله الصحيحه
	const [rightPointer, setRightPointer] = useState(0);

	// مصفوفه لجمع الحروف الخاطئه
	const [wrongChar, setWrongChar] = useState([]);

	const [wrongWord, setWrongWord] = useState([]);

	const [wordPointer, setWordPointer] = useState(0);
	// متغير لتخزين الوقت
	const [time, setTime] = useState(0);

	// متغير لتحديد ما اذا كانت تم بدء الكتابه ام لا
	const [startText, setStartText] = useState(false);

	// متغير لبدء الوقت و الايقاف
	const [start, setStart] = useState(false);

	// متغير لتخزين قيمة معدل الكتابة في الدقيقة
	const [Wpm, setWpm] = useState(0);

	//  متغير لتحديد شكل واجة المسخدم
	const [step, setStep] = useState(0);

	// متغير لتحديد هل تم الانتهاء من الكتابه
	const [isFinish, setFinished] = useState(false);

	const [inputValue, setInputValue] = useState('');

	const [totalEvent, setTotalEvent] = useState('');

	const [accuracy, setAccuracy] = useState(0);

	// أختيار قطعه نصية عشاوئيا من الكائن
	var randomProperty = async function () {
		var keys = await Object.keys(textdata);
		setData(textdata[keys[(keys.length * Math.random()) << 0]]);
	};

	// يتم استدعاء الداله السابقه في كل مره يحدث تغير في المتغير داتا
	useEffect(() => {
		randomProperty(textdata);
	}, []);

	// مؤقت يعمل في كل مره تتغير قيمة ستارت الى ترو
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

	// داله تسبقبل الحدث من الانبوت
	const onType = (e) => {
		setInputValue(e.target.value);
		if (e.nativeEvent.inputType !== 'deleteContentBackward') {
			setTotalEvent(totalEvent + e.target.value.slice(-1));
			setCharPointer(totalEvent.length + 1);
		}

		// إذا كان الحدث هو الاول يتم بدء الؤقت
		// في كل مره يتم كتابة حرف يزيد المشر العام ب1
		if (startText == false) {
			setStartText(true);
			setStart(true);
		}

		// في كل مره يكون الحرف المدخل مطابق لحرف المؤشر العام نزيد مؤشر الحروف الصحيحه ب1
		if (
			data.slice(0, charPointer + 1) ===
			totalEvent + e.target.value.slice(-1)
		) {
			setRightPointer(totalEvent.length + 1);
			if (e.target.value.slice(-1) === ' ') {
				setWordPointer(wordPointer + 1);
				setInputValue(' ');
			}
			// console.log(rightPointer + 1, data.length);
			if (rightPointer + 1 === data.length) {
				setStartText(false);
				setStart(false);
				WPM();
				setStep(3);
				setFinished(true);
			}
		} else if (e.nativeEvent.inputType !== 'deleteContentBackward') {
			setWrongChar([...wrongChar, data[charPointer]]);
			if (!wrongWord.includes(data.split(' ')[wordPointer])) {
				setWrongWord([...wrongWord, data.split(' ')[wordPointer]]);
			}
		}
	};

	// console.log(
	// 	'totalEvent: ' + totalEvent,
	// 	'totalEventLength: ' + totalEvent.length,
	// 	'dataSlice: ' + data.slice(0, charPointer),
	// 	'dataRight: ' + data.slice(0, rightPointer),
	// 	'currentWord: ' + data.split(' ')[wordPointer],
	// 	'dataLenght: ' + data.slice(0, charPointer).length,
	// 	'RP: ' + rightPointer,
	// 	'CP: ' + charPointer
	// );

	// داله تسبقبل الحدث من الانبوت
	const onDelete = (e) => {
		// اذا كان الحدث هو زر المسح يتم التحقق ان الانبوت غير فاضي
		if (e.key === 'Backspace' && e.target.value.length !== 0) {
			// في هذه الحاله ينقص المرؤشر العام ب1
			setTotalEvent(totalEvent.slice(0, -1));
			setCharPointer(totalEvent.length - 1);
			// في حاله انه المؤشر العام و مؤشر الحروف الصحيحه متساويان يتم تنقيص مؤشر الحروف الصحيحه ايضا
			if (charPointer == rightPointer) {
				setRightPointer(rightPointer - 1);
			}
		}
	};
	const ResetText = (x) => {
		setCharPointer(0);
		setRightPointer(0);
		setWrongChar([]);
		setTime(0);
		setStart(false);
		setStartText(false);
		setWpm(0);
		setWordPointer(0);
		setInputValue('');
		setTotalEvent('');
		setFinished(false);
		setAccuracy(0);
		if (x === 'new') {
			randomProperty(textdata);

			setData('');
		}
	};

	// تم استعمال المعادلة التاليه من الموقع التالي
	// https://indiatyping.com/index.php/typing-tips/typing-speed-calculation-formula
	const WPM = () => {
		var Accuracy = 0;
		var GrossWPM = 0;
		var NetWPM = 0;
		var sec = Math.floor((time / 1000) % 60);
		var min = Math.floor((time / 60000) % 60);
		var now = (min * 60 + sec) / 60;
		GrossWPM = data.length / 5;
		GrossWPM = GrossWPM / now;
		NetWPM = GrossWPM - wrongWord.length / now;
		Accuracy = (NetWPM / GrossWPM) * 100;
		setWpm(Math.round(NetWPM));
		setAccuracy(Math.round(Accuracy));
	};

	return (
		<div className=" items-center h-screen  bg-gray-100  grid grid-cols-12 max-w-screen gap-4">
			<main className="h-screen w-full text-center  col-start-2 col-span-10 ">
				<nav className="grid grid-cols-11 py-5">
					<div className=" space-x-10 col-start-1 flex flex-row items-center font-semibold">
						<Link href="/ar">
							<a className="font-cairo">عربي</a>
						</Link>
					</div>
					<span className=" uppercase text-4xl font-bold font-houseslant text-gray-700 col-start-5 col-span-3">
						speed Writer
					</span>
					<div className="space-x-10 col-start-11 flex flex-row items-center font-semibold">
						<a>Login</a>
						<a>Register</a>
					</div>
				</nav>
				<div className="grid grid-cols-11 h-full w-full gap-4 items-center">
					{step == 0 ? (
						<>
							<div className="col-start-2 col-span-9 space-y-20">
								<span className="text-left text-2xl font-bold text-gray-600 font-inter ">
									Start testing yourself and{' '}
									<span className="bg-gray-200 underline decoration-lime-400">
										improve
									</span>{' '}
									you'r typing skils.
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
						<div className="col-start-2 col-span-9 space-y-20 w-full leading-10">
							{!isFinish ? (
								<button
									className="block uppercase font-cairo focus:shadow-outline focus:outline-none text-green-600 text-xs py-3  rounded font-bold  w-32"
									onClick={() => {
										ResetText('new');
									}}
								>
									Change
								</button>
							) : null}
							<span className="text-2xl font-bold text-gray-600 font-inter">
								{data.split('').map((i, x) => {
									if (x < charPointer) {
										if (x < rightPointer) {
											return (
												<span className="text-gr een-400 bg-gray-200 underline decoration-lime-400">
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
							{!isFinish ? (
								<div className="w-full flex justify-center items-center">
									<input
										value={inputValue}
										placeholder="Go"
										onChange={onType}
										ref={(input) => input && input.focus()}
										onKeyDown={onDelete}
										className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-1/2"
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

{
	/* <div className="text-left text-2xl font-bold text-gray-400 font-inter"> */
}
{
	/* <span>
									{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
								</span>
								<span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
							</div> */
}
