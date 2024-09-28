'use client'

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

type Props = {
    roomId: string;
    idTitle: string;
}

const Playground = ({ roomId, idTitle }: Props) => {

    const username = useGetUsername();
    const [code, setCode] = useState<string>('// Your code here');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingUser, setSubmittingUser] = useState<string | null>(null);
    const socket = useSocket();
    const { toast } = useToast();

    useEffect(() => {
        if (socket) {
            socket.on('codeChange', (newCode: string) => {
                setCode(newCode);
            });

            socket.on('submissionStart', (username: string) => {
                setIsSubmitting(true);
                setSubmittingUser(username);
                // console.log("submissionStart", username);
            });

            socket.on('submissionResult', (result: { success: boolean, message: string }) => {
                setIsSubmitting(false);
                setSubmittingUser(null);
                console.log("submissionResult", result);
            });
        }

        return () => {
            if (socket) {
                socket.off('codeChange');
                socket.off('submissionStart');
                socket.off('submissionResult');
            }
        };
    }, [socket, toast]);

    useEffect(() => {
        setCode(problems[idTitle].starterCode);
    }, [idTitle]);

    const handleCodeChange = (value: string) => {
        setCode(value);
        if (socket) {
            socket.emit('codeChange', { roomId, code: value });
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setSubmittingUser(username); // Assuming the current user is submitting
        
        if (socket) {
            socket.emit('submitCode', { roomId, code });
        }

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmittingUser(null);

            try {
                const cb = new Function(`return ${code}`)();
                const handler = problems[idTitle].handlerFunction;

                if (typeof handler === 'function') {
                    const success = handler(cb);
                    if (success) {
                        toast({
                            title: "Success!",
                            description: "Congratulations, All tests passed!",
                        });
                    } else {
                        throw new Error("Some tests failed");
                    }
                }
            } catch (error: any) {
                if (error.message === "Some tests failed") {
                    toast({
                        title: "Error",
                        description: "Oops! One or more test cases failed",
                    });
                } else if (error.message.startsWith('AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:')) {
                    toast({
                        title: "Error",
                        description: "Oops! One or more test cases failed",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: error.message,
                    });
                }
            }

            if (socket) {
                socket.emit('submissionResult', { roomId, success: false, message: "Some tests failed. Please try again." });
            }
        }, 3000);
    };

        // if (typeof handler === 'function') {
        //     const success = handler(cb);
        //     if (success) {
        //         console.log('Accepted');
        //         if (socket) {
        //             socket.emit('submissionResult', { roomId, success: true, message: "Congratulations, All tests passed!" });
        //             toast({
        //                 title: "Success!",
        //                 description: "Congratulations, All tests passed!",
        //             });
        //         }
        //     } else {
        //         console.log('Wrong Answer');
        //         if (socket) {
        //             socket.emit('submissionResult', { roomId, success: false, message: "Some tests failed. Please try again." });
        //             toast({
        //                 title: "Error",
        //                 description: "Some tests failed. Please try again.",
        //             });
        //         }
        //     }
        // }
    // };

    return (
        <div>
            Playground
            <PlaygroundHeader />
            <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60,40]} minSize={60}>


                <div className='w-full overflow-auto'>
                    <CodeMirror 
                        // value={boilerplate}
                        value={code}
                        theme={vscodeLight}
                        extensions={[javascript()]}
                        // style={{fontSize: settings.fontSize}}
                        onChange={handleCodeChange}
                    />
                </div>
                <div className='w-full px-5 overflow-auto'>
                    {/* Bottom tabs */}
                    <div className="h-1/2 overflow-auto">
                        <Tabs defaultValue="testcase">
                        <TabsList>
                            <TabsTrigger value="testcase">Testcase</TabsTrigger>
                            <TabsTrigger value="result">Result</TabsTrigger>
                            <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                            <TabsTrigger value="users">Users</TabsTrigger>
                        </TabsList>
                        <TabsContent value="testcase" className="p-4">
                            {/* <pre className="p-2 rounded">
                            <code>
                                {`s = "abc"
                                    t = "ahbgdc"`}
                            </code>
                            </pre> */}
                            <TestCases problem={problems[idTitle]} />
                        </TabsContent>
                        <TabsContent value="result">Test result content</TabsContent>
                        <TabsContent value="whiteboard">Whiteboard content</TabsContent>
                        <TabsContent value="chat">Chat messages content</TabsContent>
                        <TabsContent value="users">
                            <div className="flex items-center space-x-2 p-2">
                            <UsersIcon className="w-4 h-4" />
                            <span>User1, User2, User3</span>
                            </div>
                        </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </Split>

            <PlaygroundFooter handleSubmit={handleSubmit} />
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