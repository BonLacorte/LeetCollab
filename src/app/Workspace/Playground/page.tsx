import React, { useEffect, useState } from 'react'
import Split from 'react-split';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersIcon } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { useSocket } from '@/components/SocketProvider';
import PlaygroundFooter from '@/components/workspace/PlaygroundFooter';
import { problems } from '@/lib/problems';
import PlaygroundHeader from '@/components/workspace/PlaygroundHeader';
import TestCases from './TestCases/page';
import { useToast } from '@/hooks/use-toast';
import LoadingSubmitModal from './LoadingSubmitModal';
import { useGetUsername } from '@/hooks/useGetUsername';
import { DBProblem, Problem, TestCase } from '@/types/problems';
import Chat from './Chat/page';
import Members from './Members/page';
import TestResults from './TestResults/page';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import Whiteboard from './Whiteboard/page';
import { useUpdateUserProblemSolvedMutation } from '@/app/state/api';

type Props = {
    roomId: string;
    idTitle: string;
    setSuccess: (success: boolean) => void;
    setSolved: (solved: boolean) => void;
    dbProblem: DBProblem;
    problem: Problem;
}

const Playground = ({ roomId, idTitle, setSuccess, setSolved, dbProblem, problem }: Props) => {

    const username = useGetUsername();
    const [code, setCode] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingUser, setSubmittingUser] = useState<string | null>(null);
    // const [libProblem, setLibProblem] = useState<Problem | null>(null);
    const socket = useSocket();
    const { toast } = useToast();
    const { data: session } = useSession();

    const [testResults, setTestResults] = useState<TestCase[] | null>(null);
    const [runtime, setRuntime] = useState<number | null>(null);

    const [activeTab, setActiveTab] = useState<string>("testcase");

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const [updateUserProblemSolved] = useUpdateUserProblemSolvedMutation();

    // const toggleDarkMode = () => {
    //     dispatch(setIsDarkMode(!isDarkMode));
    // }
    
    useEffect(() => {

        // console.log('problem on playground: ', problem);

        if (socket && problem) {
            // Fetch the latest code when component mounts or page refreshes

            let isMounted = true;

            socket.emit('getLatestCode', { roomId, starterCode: problem.starterCode }, (response: { code: string }) => {
                if (isMounted) {
                    console.log("getLatestCode response: ", response);
                    setCode(response.code);
                }
            });

    
            const handleCodeChange = (newCode: string) => {
                setCode(newCode);
            };
    
            const handleSubmissionStart = (username: string) => {
                // console.log("submissionStart on client", username);
                setIsSubmitting(true);
                setSubmittingUser(username);
            };
    
            const handleSubmissionResult = (result: { success: boolean, message: string }) => {
                setIsSubmitting(false);
                setSubmittingUser(null);
                // console.log("submissionResult", result);
            };
    
            const handleSubmissionToast = (toastData: { message: string, type: string }) => {
                // console.log("submissionToast", toastData);
                if (toastData.type === "success") {
                    setSuccess(true);
                    toast({
                        title: toastData.type,
                        description: toastData.message,
                    });
                    setSolved(true);
                } else {
                    toast({
                        title: toastData.type,
                        description: toastData.message,
                    });
                }
            };
    
            const handleUpdateSolvedStatus = async (problemId: string) => {
                console.log("updateSolvedStatus other user");
                console.log("problemId: ", problemId);
                console.log("session.user.id: ", session?.user?.id);
                if (session?.user?.id && problemId) {
                    try {
                        setTimeout(() => {
                            setSuccess(false);
                        }, 5000);
                        await updateUserProblemSolved({
                            userId: session.user.id,
                            problemId: problemId,
                        }).unwrap();
                        console.log("updateSolvedStatus other user - solved");
                        setSolved(true);
                    } catch (error) {
                        console.error("Failed1 to mark problem as solved:", error);
                    }
                }
            };
            

            socket.on('codeChange', handleCodeChange);
            socket.on('submissionStart', handleSubmissionStart);
            socket.on('submissionResult', handleSubmissionResult);
            socket.on('submissionToast', handleSubmissionToast);
    
            socket.on('updateSolvedStatus', handleUpdateSolvedStatus);

            // Re-join the room to ensure proper connection
            socket.emit('joinRoom', { roomId, username, code }, (response: any) => {
                if (response.success) {
                    console.log('joinRoom - Reconnected to room:', roomId);
                    // console.log("joinRoom - code: ", code);
                } else {
                    console.error('Failed to reconnect to room:', response.message);
                }
            });

            return () => {
                socket.off('codeChange', handleCodeChange);
                socket.off('submissionStart', handleSubmissionStart);
                socket.off('submissionResult', handleSubmissionResult);
                socket.off('submissionToast', handleSubmissionToast);

                socket.off('updateSolvedStatus', handleUpdateSolvedStatus);

                isMounted = false;
            };
        }
    }, [socket, toast, setSuccess, setSolved, roomId, idTitle, problem]);

    // this is to set the code to the starter code when the idTitle changes
    // useEffect(() => {
    //     if (idTitle && problems[idTitle]) {
    //         console.log("idTitle 1: ", idTitle);
    //         setCode(problems[idTitle].starterCode);

    //         // emit codeChange event
    //         if (socket) {
    //             socket.emit('codeChange', { roomId, code: problems[idTitle].starterCode });
    //         }
    //     }
    // }, [idTitle]);

    const handleCodeChange = (value: string) => {
        setCode(value);
        if (socket) {
            socket.emit('codeChange', { roomId, code: value });
        }
    };

    const handleRun = () => {
        setIsSubmitting(true);
        setSubmittingUser(username);

        // setActiveTab("result");

        const startTime = performance.now();
        
        try {
            const cb = new Function(`return (${code})`)();
            const testCases = problems[idTitle].examples;
            // console.log('testCases: ', testCases);
            const results = testCases.map((testCase, index) => {
                // Parse input string to extract nums and target
                const inputMatch = testCase.inputText.match(/nums = (\[.*?\]),\s*target = (\d+)/);
                if (!inputMatch) {
                    throw new Error(`Invalid input format for test case ${index + 1}`);
                }
                const nums = JSON.parse(inputMatch[1]);
                const target = parseInt(inputMatch[2]);
    
                const expectedOutput = JSON.parse(testCase.outputText);
                const actualOutput = cb(nums, target);

                // console.log('actualOutput: ', actualOutput);
                // console.log('expectedOutput: ', expectedOutput);

                // console.log('passedd: ', JSON.stringify(actualOutput) === JSON.stringify(expectedOutput));

                return {
                    case: index + 1,
                    passed: JSON.stringify(actualOutput) === JSON.stringify(expectedOutput),
                    input: testCase.inputText,
                    expectedOutput: testCase.outputText,
                    actualOutput: JSON.stringify(actualOutput)
                };
            });
    
            const endTime = performance.now();
            setRuntime(Math.round(endTime - startTime));
            console.log('results: ', results);
            setTestResults(results);

            setActiveTab("result");
            // socket.emit('codeChange', { roomId, code: code });
        } catch (error: any) {
            console.error('Error in handleRun:', error);
            
            setActiveTab("result");
            toast({
                title: "Error",
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
            setSubmittingUser(null);
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setSubmittingUser(username); // Assuming the current user is submitting
        
        if (socket) {
            socket.emit('submitCode', { roomId, code });
        }

        setTimeout(async () => {
            setIsSubmitting(false);
            setSubmittingUser(null);

            try {
                // delete all ";" on the end of the code
                const codeWithoutSemicolon = code?.replace(/;$/g, '');
                console.log('code: ', codeWithoutSemicolon);
                const cb = new Function(`return (${codeWithoutSemicolon})`)();
                const handler = problems[idTitle].handlerFunction;
                

                if (typeof handler === 'function') {
                    const success = handler(cb);
                    
                    if (success) {
                        if (socket) {
                            socket.emit('submissionSuccess', { roomId, problemId: dbProblem?.problemId });
                            socket.emit('submissionMessage', { roomId, message: "Congratulations, All tests passed!", type: "success" });
                        }
                        toast({
                            title: "Success!",
                            description: "Congratulations, All tests passed!",
                        });
                        setSuccess(true);

                        if (session?.user?.id && dbProblem?.problemId) {
                            try {
                                setTimeout(() => {
                                    setSuccess(false);
                                }, 5000);
                                await updateUserProblemSolved({
                                    userId: session.user.id,
                                    problemId: dbProblem.problemId,
                                }).unwrap();
                                setSolved(true);
                                console.log("Problem marked as solved");
                            } catch (error) {
                                console.error("Failed to mark problem as solved:", error);
                            }
                        }
                    } else {
                        throw new Error("Some tests failed");
                    }
                } else {
                    throw new Error("Problem handler function not found");
                }
            } catch (error: any) {
                if (error.message === "Some tests failed") {
                    // emit submissionFailure event
                    if (socket) {
                        socket.emit('submissionMessage', { roomId, message: "Oops! One or more test cases failed", type: "error" });
                    }
                    toast({
                        title: "Error 1",
                        description: "Oops! One or more test cases failed",
                    });
                } else if (error.message.startsWith('AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:')) {
                    // emit submissionFailure event
                    if (socket) {
                        socket.emit('submissionMessage', { roomId, message: "Oops! One or more test cases failed", type: "error" });
                    }
                    toast({
                        title: "Error 2",
                        description: "Oops! One or more test cases failed",
                    });
                } else {
                    // emit submissionFailure event
                    if (socket) {
                        socket.emit('submissionMessage', { roomId, message: error.message, type: "error" });
                    }
                    toast({
                        title: "Error 3",
                        description: error.message,
                    });
                }
            } finally {
                setIsSubmitting(false);
                setSubmittingUser(null);
            }
        }, 3000);
    };

    // if the
    if (isSubmitting) {
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmittingUser(null);
        }, 3000);
    }

    return (
        <div className='border'>
            <PlaygroundHeader />
            {/* <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60,40]} minSize={60}> */}
            {/* <div className='flex flex-col h-[calc(100vh-115px)]'> */}
            <div className='flex flex-col border h-full'>

                <div className='w-full h-[calc(35vh)] border overflow-auto'>
                    <CodeMirror 
                        // value={boilerplate}
                        value={code}
                        theme={isDarkMode ? vscodeDark : vscodeLight}
                        extensions={[javascript()]}
                        // style={{fontSize: settings.fontSize}}
                        onChange={handleCodeChange}
                    />
                </div>
                <div className='w-full h-[calc(35vh)] '>
                    {/* Bottom tabs */}
                    <div className="w-full h-full overflow-auto">
                        <div className='flex flex-row w-full h-full'>
                            <div className='w-3/5 border '>
                                <Tabs defaultValue="testcase" value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList>
                                        <TabsTrigger value="testcase">Testcase</TabsTrigger>
                                        <TabsTrigger value="result">Result</TabsTrigger>
                                        <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
                                        
                                    </TabsList>
                                    <TabsContent value="testcase" className="p-4">
                                        <TestCases problem={problems[idTitle]} />
                                    </TabsContent>
                                    <TabsContent value="result" className='overflow-auto h-[30vh]'>
                                        <TestResults results={testResults} runtime={runtime} />
                                    </TabsContent>
                                    <TabsContent value="whiteboard" className='h-[30vh]'>
                                        <Whiteboard roomId={roomId} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                            <div className='w-2/5 border'>
                                <Tabs defaultValue="chat">
                                    <TabsList>
                                        <TabsTrigger value="chat">Chat</TabsTrigger>
                                        <TabsTrigger value="members">Members</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="chat">
                                        <Chat roomId={roomId} />
                                    </TabsContent>
                                    <TabsContent value="members">
                                        <Members roomId={roomId} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* </Split> */}

            <PlaygroundFooter handleSubmit={handleSubmit} handleRun={handleRun} />
            {isSubmitting && <LoadingSubmitModal username={submittingUser} />}

            {/* <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60,40]} minSize={60}> */}
                {/* <div className='w-full overflow-auto'> */}
                    {/* <CodeMirror 
                        // value={boilerplate}
                        value={userCode}
                        theme={vscodeDark}
                        extensions={[javascript()]}
                        style={{fontSize: settings.fontSize}}
                        onChange={onChange}
                    /> */}
                    {/* <div className="flex-1 overflow-auto"> */}
                        {/* <Tabs defaultValue="javascript">
                        <TabsList>
                            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        </TabsList>
                        <TabsContent value="javascript" className="p-4">
                            <pre className="bg-gray-800 p-2 rounded">
                            <code>
                                {`function isSubsequence(s, t) {
                                // Your code here
                                }`}
                            </code>
                            </pre>
                        </TabsContent>
                        </Tabs> */}
                    {/* </div> */}
                {/* </div> */}
                {/* <div className='w-full px-5 overflow-auto'> */}
                    {/* testcase heading */}
                    {/* <div className='flex h-10 items-center space-x-6'>
                        <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                            <div className='text-sm font-medium leading-5 text-white'>Testcases</div>
                            <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white'/>
                        </div>
                    </div>

                    <div className='flex'>
                        {problem.examples.map((example, index) => (
							<div
								className='mr-2 items-start mt-2 '
								key={example.id}
								onClick={() => setActiveTestCaseId(index)}
							>
								<div className='flex flex-wrap items-center gap-y-4'>
									<div
										className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
									>
										Case {index + 1}
									</div>
								</div>
							</div>
						))}
                    </div>
                    
                    <div className='font-semibold'>
                        <p className='text-sm font-medium mt-4 text-white'>Input:</p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                            {problem.examples[activeTestCaseId].inputText}
                        </div>
                        <p className='text-sm font-medium mt-4 text-white'>Output:</p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                            {problem.examples[activeTestCaseId].outputText}
                        </div>
                    </div> */}
                {/* </div> */}
            {/* </Split> */}
        </div>
    )
}

export default Playground