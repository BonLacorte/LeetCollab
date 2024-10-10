import React, { useState } from 'react';
import Timer from './Timer';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {}

const languages = [
    { name: 'JavaScript', value: 'javascript', available: true },
    { name: 'Python', value: 'python', available: false },
    { name: 'Java', value: 'java', available: false },
    { name: 'PHP', value: 'php', available: false },
];

const Language = (props: Props) => {

    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

    return (
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                // variant="outline"
                // role="combobox"
                // aria-expanded={open}
                disabled={true}
                className="w-[200px] justify-between"
              >
                {selectedLanguage.name}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <ul className="max-h-[300px] overflow-auto p-1">
                {languages.map((language) => (
                  <li
                    key={language.value}
                    className={cn(
                      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                      language.available
                        ? "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        : "cursor-not-allowed opacity-50"
                    )}
                    onClick={() => {
                      if (language.available) {
                        setSelectedLanguage(language);
                      }
                    }}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {language.value === selectedLanguage.value && <Check className="h-4 w-4" />}
                    </span>
                    {language.name}
                    {!language.available && (
                      <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                    )}
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
    )
}

export default Language