import { Bell, Settings, Search, Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Footer from "@/components/Footer"

export default function ListProfessor() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-6">
          <Bell className="w-6 h-6 text-gray-600" />
          <Settings className="w-6 h-6 text-gray-600" />
          <Button variant="outline" size="sm" className="px-4">
            로그인
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-8 py-10 flex-grow">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">나의 강의 리스트</h1>
          <p className="text-lg text-gray-600">담당 혹은 강의를 확인하고 질문을 관리해보세요.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-4xl mx-auto">
          <Input
            type="text"
            placeholder="강의명을 입력하세요"
            className="w-full pl-5 pr-12 py-6 text-lg rounded-full border-gray-300"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>

        {/* Today's Lectures */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold">오늘 강의 (2025.00.00)</h2>
            </div>
            <div className="flex items-center space-x-6 text-base">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span>질문 대기중</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                <span>질문 보류</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                <span>질문 작성</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border flex items-center justify-between">
              <span className="text-lg text-gray-700">수업 이름 (강의실 이름)</span>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2">
                강의
              </Button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border flex items-center justify-between">
              <span className="text-lg text-gray-700">수업 이름 (강의실 이름)</span>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2">
                강의
              </Button>
            </div>
          </div>
        </section>

        {/* All Lectures */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold">전체 강의</h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-3 mb-8">
            <Button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 text-base">최신 등록 순</Button>
            <Button variant="outline" className="px-6 py-2 text-base border-gray-300 text-gray-700 hover:bg-gray-50">
              질문 많은 순
            </Button>
            <Button variant="outline" className="px-6 py-2 text-base border-gray-300 text-gray-700 hover:bg-gray-50">
              이름 순 (가나다)
            </Button>
          </div>

          {/* Lecture List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-10">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border flex items-center justify-between">
                <span className="text-lg text-gray-700">수업 이름 (강의실 이름)</span>
                <Button size="sm" className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2">
                  강의
                </Button>
              </div>
            ))}
          </div>

          {/* More Button */}
          <div className="text-center">
            <Button
              variant="outline"
              className="flex items-center space-x-2 px-6 py-2 text-base mx-auto border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <span>더보기</span>
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
