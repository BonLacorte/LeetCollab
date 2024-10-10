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
            const codeWithoutSemicolon = code?.replace(/;$/g, '');
            console.log('code: ', codeWithoutSemicolon);
            const cb = new Function(`return (${codeWithoutSemicolon})`)();

            const run = problems[idTitle].handlerRun;
            const results = run(cb);

            console.log('handlerRun results: ', results);

            const endTime = performance.now();
            setRuntime(Math.round(endTime - startTime));
            setTestResults(results);
            setActiveTab("result");

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
                } else if (error.message.startsWith('AssertionError: Expected values to be loosely deep-equal:')) {
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
        <div className='border-t'>
            <PlaygroundHeader />
            {/* <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60,40]} minSize={60}> */}
            {/* <div className='flex flex-col h-[calc(100vh-115px)]'> */}
            <div className='flex flex-col h-full'>

                <div className='w-full h-[calc(38.8vh)] border overflow-auto'>
                    <CodeMirror 
                        // value={boilerplate}
                        value={code}
                        theme={isDarkMode ? vscodeDark : vscodeLight}
                        extensions={[javascript()]}
                        // style={{fontSize: settings.fontSize}}
                        onChange={handleCodeChange}
                    />
                </div>
                <div className='w-full h-[calc(38.8vh)] border border-l'>
                    {/* Bottom tabs */}
                    <div className="w-full h-full overflow-auto">
                        <div className='flex flex-row w-full h-full'>
                            <div className='w-3/5 border-r'>
                                <Tabs defaultValue="testcase" value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className='bg-gray-200'>
                                        <TabsTrigger value="testcase" className="hover:bg-gray-300 px-4">Testcase</TabsTrigger>
                                        <TabsTrigger value="result" className="hover:bg-gray-300 px-4">Result</TabsTrigger>
                                        <TabsTrigger value="whiteboard" className="hover:bg-gray-300 px-4">Whiteboard</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="testcase" className="p-4">
                                        <TestCases problem={problems[idTitle]} />
                                    </TabsContent>
                                    <TabsContent value="result" className='overflow-auto h-[35vh]'>
                                        <TestResults results={testResults} runtime={runtime} />
                                    </TabsContent>
                                    <TabsContent value="whiteboard" className='h-[35vh]'>
                                        <Whiteboard roomId={roomId} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                            <div className='w-2/5'>
                                <Tabs defaultValue="chat">
                                    <TabsList className='bg-gray-200'>
                                        <TabsTrigger value="chat" className='hover:bg-gray-300 px-4'>Chat</TabsTrigger>
                                        <TabsTrigger value="members" className='hover:bg-gray-300 px-4'>Members</TabsTrigger>
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

        </div>
    )
}

export default Playground