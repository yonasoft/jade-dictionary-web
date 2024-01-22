"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Button,
  Paper,
  Title,
  Text,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { RecognizedChar } from "@/src/lib/types/hanzi-lookup";
import { Path } from "@/src/lib/types/point";

type Props = {
  query: string;
  setQuery: (input: string) => void;
};

const ChineseHandwriting = ({ query, setQuery }: Props) => {
  const [recognizedChars, setRecognizedChars] = useState<RecognizedChar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState({ mmah: false, orig: false });
  const [paths, setPaths] = useState<Array<Array<Path>>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hanziLookupMatcher = useRef<any>(null);

  useEffect(() => {
    const loadHanziLookup = async () => {
      const script = document.createElement("script");
      script.src = "/raw/hanzi-lookup/hanzilookup.min.js";
      document.body.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });

      window.HanziLookup.init(
        "mmah",
        "/raw/hanzi-lookup/mmah.json",
        () => fileLoaded(true, "mmah") // explicitly pass type here
      );
      window.HanziLookup.init(
        "orig",
        "/raw/hanzi-lookup/orig.json",
        () => fileLoaded(true, "orig") // explicitly pass type here
      );
    };

    const fileLoaded = (success: boolean, type: "mmah" | "orig") => {
      if (!success) {
        console.error(`Failed to load ${type} file.`);
        setLoading(false);
      } else {
        console.log(`${type} file loaded successfully.`);
        setDataLoaded((prev) => ({ ...prev, [type]: true }));

        if (dataLoaded.mmah && dataLoaded.orig && !hanziLookupMatcher.current) {
          try {
            hanziLookupMatcher.current = new window.HanziLookup.Matcher("mmah"); // you might want to choose "mmah" or "orig"
            console.log("Matcher initialized");
            setLoading(false);
          } catch (error) {
            console.error("Error initializing matcher: ", error);
          }
        }
      }
    };

    loadHanziLookup();
  }, [dataLoaded.mmah, dataLoaded.orig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const drawCanvas = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      paths.forEach((path) => {
        ctx.beginPath();
        path.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      });
    };

    drawCanvas();
  }, [paths]);

  const performCharacterLookup = useCallback(() => {
    if (hanziLookupMatcher.current && paths.length > 0) {
      const analyzedChar = new HanziLookup.AnalyzedCharacter(paths);
      hanziLookupMatcher.current.match(
        analyzedChar,
        24,
        (matches: RecognizedChar[]) => {
          const sortedMatches = matches
            .sort((a, b) => b.score - a.score)
            .slice(0, 24);
          setRecognizedChars(sortedMatches);
        }
      );
    } else {
      setRecognizedChars([]);
    }
  }, [paths]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);
      const point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      setPaths((prevPaths) => [...prevPaths, [point]]);
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const point = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };
      setPaths((prevPaths) => {
        const lastPath = prevPaths[prevPaths.length - 1];
        const newPath = [...lastPath, point];
        return [...prevPaths.slice(0, -1), newPath];
      });
    },
    [isDrawing]
  );

  const handleMouseUpOrLeave = useCallback(() => {
    setIsDrawing(false);
    performCharacterLookup(); // Perform character lookup when the stroke is completed
  }, [performCharacterLookup]);

  const handleUndo = () => {
    setPaths((prevPaths) => prevPaths.slice(0, -1));
    performCharacterLookup(); // Perform character lookup after undoing a stroke
  };

  const handleClear = () => {
    setPaths([]);
    setRecognizedChars([]);
  };

  const handleCharacterClick = (character: string) => {
    setQuery(query + character);
    handleClear();
  };

  return (
    <div className="flex flex-col items-center z-50">
      <LoadingOverlay visible={loading} />
      <Paper className="content mx-auto p-3 bg-green-500 text-white rounded-lg w-full max-w-2xl sm:max-w-xl">
        <div className="flex flex-col md:flex-row">
          <div className="colLeft w-full md:w-1/3 pr-3 mb-4 md:mb-0">
            <Title order={2} className="text-lg sm:text-xl">
              Stroke input
            </Title>
            <canvas
              ref={canvasRef}
              width={250}
              height={250}
              className="drawingBoard bg-white"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            />
            <Group flex="space-between" mt="md">
              <Button onClick={handleUndo} className="cmdUndo">
                Undo
              </Button>
              <Button onClick={handleClear} className="cmdClear">
                Clear
              </Button>
            </Group>
          </div>
          <div className="colRight w-full md:w-2/3 pl-3 flex flex-col justify-center">
            <Title order={2} className="text-lg sm:text-xl">
              Recognized characters
            </Title>
            <div className="flex justify-center items-center">
              <Paper className="charPicker hanziLookupChars m-4 border border-gray-400 p-1 min-h-[4rem] bg-white overflow-hidden flex flex-wrap justify-center items-center">
                {recognizedChars.length > 0 ? (
                  recognizedChars.map((match: RecognizedChar, index) => (
                    <Text
                      key={index}
                      component="span"
                      className="cursor-pointer mx-2 p-1 hover:bg-slate-300 rounded-md"
                      c="black"
                      onClick={() => handleCharacterClick(match.character)}
                    >
                      {match.character}
                    </Text>
                  ))
                ) : (
                  <Text component="span" className="text-center text-gray-400">
                    Draw a character to begin recognition...
                  </Text>
                )}
              </Paper>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default ChineseHandwriting;
