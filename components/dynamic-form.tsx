'use client';
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BoxSelectIcon, SquareCheck, Trash2 } from 'lucide-react';
import { nanoid as uid } from 'nanoid';

type submitProps = {
    users: {
        name: string;
        email: string;
    }[];
}

let renderCount = 0;
export default function DynamicForm() {
    const [first, setFirst] = useState(-1);
    const [second, setSecond] = useState(-1);
    const [mounted, setMounted] = useState(false);
    const { register, control, handleSubmit, reset } = useForm({
        defaultValues: {
            users: [{ name: '', email: '' }],
        },
    });
    const { fields, append, prepend, remove, swap, move } = useFieldArray({
        control,
        name: 'users',
    });
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    function onSubmit(values: submitProps) {
        const withUUID = values.users.map((user) => ({
            ...user,
            user_id: uid(12).toUpperCase(),
        }));
        console.log(withUUID);
    }
    renderCount++;
    function setSelection(index: number) {
        if (first === second && first !== -1 && second !== -1) {
            setFirst(-1);
            setSecond(-1);
        } else if (first === index) {
            setFirst(-1);
        } else if (second == index) {
            setSecond(-1);
        } else if (first === -1 && second === -1) {
            setFirst(index);
        } else if (first !== -1 && second === -1) {
            setSecond(index);
        } else if (first !== second && second !== -1) {
            setFirst(index);
        } else if (second !== first && first !== -1) {
            setSecond(index);
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Field Array </h1>
            <p>The following demo allow you to delete, append, prepend items</p>
            <span className="counter">Render Count: {renderCount}</span>
            <p>Current First: {first}</p>
            <p>Current Second: {second}</p>
            <ul className="flex flex-col gap-4">
                {fields.map((item, index) => {
                    return (
                        <li key={item.id}>
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex items-center gap-2">
                                    {first === index || second === index ? (
                                        <SquareCheck
                                            onClick={() => setSelection(index)}
                                            className="cursor-pointer"
                                        />
                                    ) : (
                                        <BoxSelectIcon
                                            onClick={() => setSelection(index)}
                                            className="cursor-pointer"
                                        />
                                    )}

                                    <Input
                                        className="focus:ring-offset-0 focus:outline-none ring-offset-0"
                                        {...register(`users.${index}.name`, {
                                            required: true,
                                        })}
                                        onClick={() => {}}
                                        placeholder="Name"
                                    />
                                </div>

                                <Controller
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Email" />
                                    )}
                                    name={`users.${index}.email`}
                                    control={control}
                                />
                                <Button
                                    type="button"
                                    size={'icon'}
                                    variant={'ghost'}
                                    className="border border-rose-300 hover:border-rose-600"
                                    onClick={() => {
                                        remove(index);
                                        if (index === first) {
                                            setFirst(-1);
                                        } else if (index === second) {
                                            setSecond(-1);
                                        }
                                    }}>
                                    <Trash2 className="h-8 w-8 p-1 text-rose-500" />
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <section className="flex gap-3 mt-5">
                <Button
                    type="button"
                    onClick={() => {
                        append({ name: '', email: '' });
                    }}>
                    append
                </Button>
                <Button
                    type="button"
                    onClick={() =>
                        prepend({
                            name: '',
                            email: '',
                        })
                    }>
                    Add On Top
                </Button>
                <Button type="button" onClick={() => swap(first, second)}>
                    Swap
                </Button>

                <Button type="button" onClick={() => move(first, second)}>
                    Move
                </Button>

                <Button
                    type="button"
                    onClick={() => {
                        remove(first);
                        setFirst(-1);
                    }}>
                    Remove
                </Button>

                <Button
                    type="button"
                    onClick={() => {
                        setFirst(-1);
                        setSecond(-1);
                        reset({
                            users: [{ name: '', email: '' }],
                        });
                    }}>
                    reset
                </Button>
            </section>

            <Button variant={'destructive'} className="mt-10" type="submit">
                Submit
            </Button>
        </form>
    );
}
