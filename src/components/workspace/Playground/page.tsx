'use client'

import React, { useEffect, useState } from 'react'
import Split from 'react-split';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersIcon } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
// import { python } from '@codemirror/legacy-modes/mode/python';
import { dracula } from '@uiw/codemirror-theme-dracula';
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
import { useCreateSubmissionMutation, useUpdateUserSolvedProblemMutation } from '@/app/state/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area';
import Timer from '@/components/workspace/Timer';

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

    const [activeTabLeft, setActiveTabLeft] = useState<string>("testcase");
    const [activeTabRight, setActiveTabRight] = useState<string>("chat");

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const [updateUserSolvedProblem] = useUpdateUserSolvedProblemMutation();
    const [createSubmission] = useCreateSubmissionMutation();
    
    useEffect(() => {
        if (socket && problem) {

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
    
            const handleSubmissionStart = async (username: string, problemId: string) => {
                // console.log("submissionStart on client", username);

                
                setIsSubmitting(true);
                setSubmittingUser(username);
            };
    
            const handleSubmissionResult = (result: { success: boolean, message: string }) => {
                setIsSubmitting(false);
                setSubmittingUser(null);
                // console.log("submissionResult", result);
            };
    
            const handleSubmissionToast = async (toastData: { message: string, type: string }) => {
                // console.log("submissionToast", toastData);
                if (toastData.type === "success") {
                    setSuccess(true);
                    toast({
                        className: "bg-white text-gray-900 border border-gray-200 shadow-xl rounded-xl",
                        title: toastData.type,
                        description: toastData.message,
                    });
                    setSolved(true);
                } else {
                    if (session?.user?.id && dbProblem?.problemId) {
                        await createSubmission({
                            userId: session.user.id,
                            problemId: dbProblem.problemId,
                            status: "Wrong Answer",
                        }).unwrap();
                    }
                    toast({
                        className: "bg-white text-gray-900 border border-gray-200 shadow-xl rounded-xl",
                        title: toastData.type,
                        description: toastData.message,
                    });
                }
            };
    
            const handleUpdateSolvedStatus = async (problemId: string) => {
                console.log("updateSolvedStatus other user");
                console.log("problemId: ", problemId);
                // problemId = problemId.toString();
                console.log("session.user.id: ", session?.user?.id);
                if (session?.user?.id && problemId) {
                    try {
                        setTimeout(() => {
                            setSuccess(false);
                        }, 5000);
                        await updateUserSolvedProblem({
                            userId: session.user.id,
                            problemId: problemId,
                        }).unwrap();
                        console.log("updateSolvedStatus (other user) - solved");
                        console.log("updateSolvedStatus (other user) - creating submission");
                        console.log("updateSolvedStatus (other user) - userId: ", session?.user?.id);
                        console.log("updateSolvedStatus (other user) - problemId: ", problemId);
                        if (session?.user?.id && problemId) {
                            await createSubmission({
                                userId: session.user.id,
                                problemId: problemId,
                                status: "Accepted",
                            }).unwrap();
                        }
                        console.log("updateSolvedStatus other user - created submission");
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
            const codeWithoutSemicolon = code?.replace(/;$/g, '');
            console.log('code: ', codeWithoutSemicolon);
            const cb = new Function(`return (${codeWithoutSemicolon})`)();

            const run = problems[idTitle].handlerRun;
            const results = run(cb);

            console.log('handlerRun results: ', results);

            const endTime = performance.now();
            setRuntime(Math.round(endTime - startTime));
            setTestResults(results);
            setActiveTabLeft("result");

        } catch (error: any) {
            console.error('Error in handleRun:', error);
            
            setActiveTabLeft("result");
            toast({
                className: "bg-white text-gray-900 border border-gray-200 shadow-xl rounded-xl",
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
            socket.emit('submitCode', { roomId, username });
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
                            className: "bg-white text-gray-900 border border-gray-200 shadow-xl rounded-xl",
                            title: "Success!",
                            description: "Congratulations, All tests passed!",
                        });
                        setSuccess(true);

                        if (session?.user?.id && dbProblem?.problemId) {
                            try {
                                setTimeout(() => {
                                    setSuccess(false);
                                }, 5000);
                                await updateUserSolvedProblem({
                                    userId: session.user.id,
                                    problemId: dbProblem.problemId,
                                }).unwrap();
                                console.log("submissionStart (handleSubmit) - updated solved status");
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
                        socket.emit('submissionMessage', { roomId, message: "Oops! One or more test cases failed", type: "Error" });
                    }
                } else if (error.message.startsWith('AssertionError')) {
                    // emit submissionFailure event
                    if (socket) {
                        socket.emit('submissionMessage', { roomId, message: "Oops! One or more test cases failed", type: "Error" });
                    }
                } else {
                    // emit submissionFailure event
                    if (socket) {
                        socket.emit('submissionMessage', { roomId, message: "Something went wrong, try again later", type: "Error" });
                    }
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
        <>
            {/* <PlaygroundHeader /> */}
            {/* <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60,40]} minSize={60}> */}
            {/* <div className='flex flex-col h-[calc(100vh-115px)]'> */}
            <div className='flex flex-col h-full gap-8 lg:pr-8'>

                <Card className='w-full h-[41vh] bg-white rounded-xl shadow-md p-8 border-none'>
                    <div className='flex flex-row justify-between items-center mb-4'>
                        <p className='text-lg text-gray-500 font-medium rounded-3xl px-4 py-2 bg-gray-200'>Javascript</p>
                        {/* <Timer /> */}
                        <PlaygroundFooter handleSubmit={handleSubmit} handleRun={handleRun} />
                    </div>
                    <ScrollArea className='h-[29vh]'>
                        <CodeMirror 
                            // value={boilerplate}
                            value={code}
                            theme={isDarkMode ? dracula : vscodeLight}
                            extensions={[javascript()]}
                            // style={{fontSize: settings.fontSize}}
                            onChange={handleCodeChange}
                        />
                    </ScrollArea>
                </Card>
                <div className='w-full h-full lg:h-[calc(41vh)] overflow-auto'>
                    {/* Bottom tabs */}
                    {/* <div className="w-full h-full overflow-auto"> */}
                    {/* <div className="w-full h-full "> */}
                        <div className='flex flex-col xl:flex-row w-full h-full gap-8 rounded-xl border-none'>
                            <Card className='flex flex-col bg-white w-full xl:w-2/3 gap-4 p-8 border-none rounded-xl'>
                                <div className='flex w-full justify-start'>
                                    <div
                                        className={`flex items-center relative text-sm font-medium rounded-2xl px-4 py-2 cursor-pointer whitespace-nowrap
                                            ${activeTabLeft  === "testcase" ? "text-gray-900 bg-gray-200" : "text-gray-500"}
                                        `}
                                        onClick={() => {
                                            setActiveTabLeft("testcase")

                                            // display the testcases
                                            // <TestCases problem={problems[idTitle]} />
                                        }}
                                    >
                                        Testcases
                                    </div>
                                    <div
                                        className={`flex items-center relative text-sm font-medium rounded-2xl px-4 py-2 cursor-pointer whitespace-nowrap
                                            ${activeTabLeft === "result" ? "text-gray-900 bg-gray-200" : "text-gray-500"}
                                        `}
                                        onClick={() => setActiveTabLeft("result")}
                                    >
                                        Result
                                    </div>
                                    <div
                                        className={`flex items-center relative text-sm font-medium rounded-2xl px-4 py-2 cursor-pointer whitespace-nowrap
                                            ${activeTabLeft === "whiteboard" ? "text-gray-900 bg-gray-200" : "text-gray-500"}
                                        `}
                                        onClick={() => setActiveTabLeft("whiteboard")}
                                    >
                                        Whiteboard
                                    </div>
                                </div>

                                <div className='h-[35vh]'>
                                    {activeTabLeft === "testcase" && <TestCases problem={problems[idTitle]} />}
                                    {activeTabLeft === "result" && 
                                        <ScrollArea className='h-[30vh]'>
                                            <TestResults results={testResults} runtime={runtime} />
                                        </ScrollArea>
                                    }
                                    {activeTabLeft === "whiteboard" && 
                                        <div className='h-[30vh]'>
                                            <div className="block md:hidden">
                                                <p className="text-lg text-gray-900 font-semibold mb-2">This feature is not available for mobile phones</p>
                                            </div>
                                            <div className="hidden md:block h-full">
                                                <Whiteboard roomId={roomId} />
                                            </div>
                                        </div>
                                    }
                                        
                                </div>
                            </Card>

                            <Card className='flex flex-col bg-white w-full xl:w-1/3 gap-4 p-8 border-none rounded-xl'>
                                <div className='flex w-full justify-start'>
                                    <div className={`flex items-center relative text-sm font-medium rounded-2xl px-4 py-2 cursor-pointer whitespace-nowrap
                                            ${activeTabRight === "chat" ? "text-gray-900 bg-gray-200" : "text-gray-500"}
                                        `}
                                        onClick={() => setActiveTabRight("chat")}
                                    >
                                        Chat
                                    </div>
                                    <div className={`flex items-center relative text-sm font-medium rounded-2xl px-4 py-2 cursor-pointer whitespace-nowrap
                                            ${activeTabRight === "members" ? "text-gray-900 bg-gray-200" : "text-gray-500"}
                                        `}
                                        onClick={() => setActiveTabRight("members")}
                                    >
                                        Members
                                    </div>
                                </div>

                                <div className='w-full h-full'>
                                    {activeTabRight === "chat" && <Chat roomId={roomId} />}
                                    {activeTabRight === "members" && <Members roomId={roomId} />}
                                </div>
                            </Card>
                        </div>
                    {/* </div> */}
                </div>
                
            </div>
            {/* </Split> */}
            {isSubmitting && <LoadingSubmitModal username={submittingUser} />}
        </>


    )
}

export default Playground