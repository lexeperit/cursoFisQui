interface PhETViewerProps {
  url: string
  topicName: string
}

export default function PhETViewer({ url, topicName }: PhETViewerProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-gray-400 font-medium">Simulaci&oacute;n PhET &mdash; {topicName}</span>
      </div>
      <div className="flex-1 relative bg-black">
        <iframe
          src={url}
          title={`Simulaci\u00f3n PhET: ${topicName}`}
          className="absolute inset-0 w-full h-full border-0"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  )
}
